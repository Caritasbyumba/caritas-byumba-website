import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../../../components/containers/Footer';
import Header from '../../../components/containers/Header';
import { CardBody, CardTitle, SectionTitle } from '../../../components/text';
import Spinner from '../../../components/UI/spinner';
import { useSelector } from 'react-redux';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from 'react-table';
import Input from '../../../components/UI/input';
import Modal from '../../../components/UI/modal';
import {
  MdSkipPrevious,
  MdSkipNext,
  MdEdit,
  MdDelete,
  MdArchive,
} from 'react-icons/md';
import FileUpload from '../../../components/UI/FileUpload';
import axios from '../../../axios-base';
import { Button } from '../../../components/UI/button';
import { useFetchAllProjectsQuery } from '../../../features/API/admin-api-slice';
import RichTextEditor from '../../../components/UI/RichTextEditor';

const ProjectsAuthor = () => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.global.token);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data, isFetching, refetch } = useFetchAllProjectsQuery();
  const [name, setName] = useState('');
  const [enSmallDescription, setEnSmallDescription] = useState('');
  const [frSmallDescription, setFrSmallDescription] = useState('');
  const [rwSmallDescription, setRwSmallDescription] = useState('');
  const [enDescription, setEnDescription] = useState('');
  const [frDescription, setFrDescription] = useState('');
  const [rwDescription, setRwDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isMain, setIsMain] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [projectId, setProjectId] = useState('');

  const updateForm = useCallback(
    (projectId) => {
      setLoading(true);
      axios
        .get(`/api/projects/${projectId}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setName(res.data.results.name);
          setEnSmallDescription(res.data.results.smallDescription.en);
          setFrSmallDescription(res.data.results.smallDescription.fr);
          setRwSmallDescription(res.data.results.smallDescription.rw);
          setEnDescription(res.data.results.description.en);
          setFrDescription(res.data.results.description.fr);
          setRwDescription(res.data.results.description.rw);
          setStartDate(new Date(res.data.results.startDate));
          setEndDate(new Date(res.data.results.endDate));
          setIsMain(res.data.results.isMain);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setError(err.response.data);
        });
    },
    [token]
  );
  const myData = useMemo(
    () =>
      data?.results
        ? data.results.map((project, index) => {
            return {
              id: index + 1,
              name: project.name,
              updatedBy: project.updatedBy.name,
              updatedAt: project.updatedAt,
              status: project.isActive,
              isMain: project.isMain,
              _id: project._id,
            };
          })
        : [],
    [data]
  );
  const columns = useMemo(
    () => [
      { Header: 'N0', accessor: 'id' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'UpdatedBy', accessor: 'updatedBy' },
      {
        Header: 'UpdatedAt',
        accessor: 'updatedAt',
        Cell: ({ value }) => {
          return new Date(value).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          return value ? 'Active' : 'Inactive';
        },
      },
      {
        Header: 'Main',
        accessor: 'isMain',
        Cell: ({ value }) => {
          return value ? 'Yes' : 'No';
        },
      },
      {
        Header: 'Actions',
        accessor: '_id',
        Cell: ({ value }) => {
          return (
            <div className="flex space-x-2 justify-center">
              <button
                className="border border-gray-500 rounded-md p-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setProjectId(value);
                  setError(null);
                  setIsUpdating(true);
                  setShowEditModal(true);
                  updateForm(value);
                }}
              >
                <MdEdit />
              </button>
              <button
                className="border border-gray-500 rounded-md p-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setShowArchiveModal(true);
                  setProjectId(value);
                  setError(null);
                }}
              >
                <MdArchive />
              </button>
              <button
                className="border border-gray-500 rounded-md p-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setShowDeleteModal(true);
                  setProjectId(value);
                  setError(null);
                }}
              >
                <MdDelete color="#751E17" />
              </button>
            </div>
          );
        },
      },
    ],
    [updateForm]
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    { columns, data: myData },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const { globalFilter, pageIndex } = state;

  const handleAdd = useCallback(() => {
    if (
      name !== '' &&
      enSmallDescription !== '' &&
      frSmallDescription !== '' &&
      rwSmallDescription !== '' &&
      enDescription !== '' &&
      frDescription !== '' &&
      rwDescription !== '' &&
      selectedFiles != null
    ) {
      setLoading(true);
      setShowProgressBar(true);
      setError(null);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('enSmallDescription', enSmallDescription);
      formData.append('frSmallDescription', frSmallDescription);
      formData.append('rwSmallDescription', rwSmallDescription);
      formData.append('enDescription', enDescription);
      formData.append('frDescription', frDescription);
      formData.append('rwDescription', rwDescription);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('isMain', isMain);
      for (let file in selectedFiles) {
        formData.append('images', selectedFiles[file]);
      }
      axios
        .post('/api/projects/add', formData, {
          headers: { Authorization: token },
          onUploadProgress: (progressEvent) => {
            setUploadProgress(
              Math.round(progressEvent.loaded / progressEvent.total) * 100
            );
          },
        })
        .then((res) => {
          setLoading(false);
          setShowEditModal(false);
          setShowProgressBar(false);
          refetch();
        })
        .catch((err) => {
          setLoading(false);
          setShowProgressBar(false);
          setError(err.response.data);
        });
    } else {
      setError({ error: t('All fields must be filled') });
    }
  }, [
    name,
    enSmallDescription,
    frSmallDescription,
    rwSmallDescription,
    enDescription,
    frDescription,
    rwDescription,
    startDate,
    endDate,
    isMain,
    selectedFiles,
    token,
    t,
    refetch,
  ]);

  const handleUpdate = useCallback(() => {
    if (
      name !== '' &&
      enSmallDescription !== '' &&
      frSmallDescription !== '' &&
      rwSmallDescription !== '' &&
      enDescription !== '' &&
      frDescription !== '' &&
      rwDescription !== ''
    ) {
      setLoading(true);
      setShowProgressBar(true);
      setError(null);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('enSmallDescription', enSmallDescription);
      formData.append('frSmallDescription', frSmallDescription);
      formData.append('rwSmallDescription', rwSmallDescription);
      formData.append('enDescription', enDescription);
      formData.append('frDescription', frDescription);
      formData.append('rwDescription', rwDescription);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('isMain', isMain);
      if (selectedFiles) {
        for (let file in selectedFiles) {
          formData.append('images', selectedFiles[file]);
        }
      }
      axios
        .patch(`/api/projects/${projectId}`, formData, {
          headers: { Authorization: token },
          onUploadProgress: (progressEvent) => {
            setUploadProgress(
              Math.round(progressEvent.loaded / progressEvent.total) * 100
            );
          },
        })
        .then((res) => {
          setLoading(false);
          setShowEditModal(false);
          setShowProgressBar(false);
          refetch();
        })
        .catch((err) => {
          setLoading(false);
          setShowProgressBar(false);
          setError(err.response.data);
        });
    } else {
      setError({ error: t('All fields must be filled') });
    }
  }, [
    name,
    enSmallDescription,
    frSmallDescription,
    rwSmallDescription,
    enDescription,
    frDescription,
    rwDescription,
    startDate,
    endDate,
    isMain,
    selectedFiles,
    token,
    t,
    refetch,
    projectId,
  ]);

  const handleArchive = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .patch(`/api/projects/archive/${projectId}`, null, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setLoading(false);
        setShowArchiveModal(false);
        refetch();
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data);
      });
  }, [token, projectId, refetch]);

  const handleDelete = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .delete(`/api/projects/${projectId}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setLoading(false);
        setShowDeleteModal(false);
        refetch();
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data);
      });
  }, [token, projectId, refetch]);

  return (
    <div>
      <Modal
        show={showEditModal}
        modalClosed={(e) => {
          setShowEditModal(false);
        }}
      >
        <CardTitle
          name={`${isUpdating ? t('Update project') : t('Add new project')}`}
          color="red"
        />
        <Input
          label={t('Name')}
          elementType="input"
          elementConfig={{
            type: 'text',
            placeholder: t('Name'),
          }}
          value={name}
          changed={setName}
          validation={{ required: true, maxLength: 50 }}
          shouldValidate
          error={t('Name is required and should be less than 50 characters')}
        />
        <div className="flex space-x-2">
          <Input
            label={t('English short description')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('English short description'),
            }}
            value={enSmallDescription}
            changed={setEnSmallDescription}
            validation={{ required: true, maxLength: 500 }}
            shouldValidate
            error={t(
              'English short description is required and should be less than 300 characters'
            )}
          />
          <Input
            label={t('French short description')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('French short description'),
            }}
            value={frSmallDescription}
            changed={setFrSmallDescription}
            validation={{ required: true, maxLength: 500 }}
            shouldValidate
            error={t(
              'French short description is required and should be less than 300 characters'
            )}
          />
          <Input
            label={t('Kinyarwanda short description')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('Kinyarwanda short description'),
            }}
            value={rwSmallDescription}
            changed={setRwSmallDescription}
            validation={{ required: true, maxLength: 500 }}
            shouldValidate
            error={t(
              'Kinyarwanda short description is required and should be less than 300 characters'
            )}
          />
        </div>
        <RichTextEditor
          label={t('English Description')}
          value={enDescription}
          onChange={(text) => setEnDescription(text)}
          placeholder={t('English Description')}
        />
        <RichTextEditor
          label={t('French Description')}
          value={frDescription}
          onChange={(text) => setFrDescription(text)}
          placeholder={t('French Description')}
        />
        <RichTextEditor
          label={t('Kinyarwanda Description')}
          value={rwDescription}
          onChange={(text) => setRwDescription(text)}
          placeholder={t('Kinyarwanda Description')}
        />
        <div className="flex space-x-2">
          <Input
            label={t('Start Date')}
            elementType="input"
            elementConfig={{
              type: 'date',
              placeholder: new Date(),
            }}
            value={startDate}
            changed={setStartDate}
          />
          <Input
            label={t('End Date')}
            elementType="input"
            elementConfig={{
              type: 'date',
              placeholder: new Date(),
            }}
            value={endDate}
            changed={setEndDate}
          />
          <Input
            label={t('Is Main project?')}
            elementType="select"
            elementConfig={{
              startingValue: 'SELECT',
              options: [
                { value: false, displayValue: 'No' },
                { value: true, displayValue: 'Yes' },
              ],
            }}
            value={isMain}
            changed={setIsMain}
            validation={{ required: true }}
            shouldValidate
            error="Is main project is required"
          />
        </div>
        <FileUpload
          elementConfig={{
            accept: 'image/*',
            multiple: true,
          }}
          btnName="Upload images"
          uploadProgress={uploadProgress}
          showProgressBar={showProgressBar}
          setSelectedFiles={setSelectedFiles}
        />
        {loading && <Spinner />}
        {error && (
          <CardBody name={error.error} color="red" additional="font-semibold" />
        )}
        <Button
          name={t('Submit')}
          isSquare
          outline="false"
          color="red"
          clicked={isUpdating ? () => handleUpdate(projectId) : handleAdd}
        />
      </Modal>
      <Modal
        show={showArchiveModal}
        small
        modalClosed={(e) => {
          setShowArchiveModal(false);
        }}
      >
        <CardTitle name={t('Archive projects')} color="red" />
        <CardBody
          name={t('Are you sure you want to archive/unarchive this projects?')}
        />
        {loading && <Spinner />}
        {error && (
          <CardBody name={error.error} color="red" additional="font-semibold" />
        )}
        <div className="flex justify-between">
          <Button
            name={t('Cancel')}
            isSquare
            outline="false"
            color="blue"
            clicked={() => setShowArchiveModal(false)}
          />
          <Button
            name={t('Archive/Unarchive')}
            isSquare
            outline="false"
            color="red"
            clicked={handleArchive}
          />
        </div>
      </Modal>
      <Modal
        show={showDeleteModal}
        small
        modalClosed={(e) => {
          setShowDeleteModal(false);
        }}
      >
        <CardTitle name={t('Delete project')} color="red" />
        <CardBody
          name={`${t('Are you sure you want to delete this project?')} ${t(
            'Contents deleted can not be retrieved.'
          )}`}
        />
        {loading && <Spinner />}
        {error && (
          <CardBody name={error.error} color="red" additional="font-semibold" />
        )}
        <div className="flex justify-between">
          <Button
            name={t('Cancel')}
            isSquare
            outline="false"
            color="blue"
            clicked={() => setShowDeleteModal(false)}
          />
          <Button
            name={t('Delete')}
            isSquare
            outline="false"
            color="red"
            clicked={handleDelete}
          />
        </div>
      </Modal>
      <Header />
      <div className="w-70% m-auto py-10">
        <SectionTitle name={t('List of all projects')} />
        {isFetching ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto relative py-5">
            <div className="flex justify-between items-center">
              <div className="w-1/3 py-3">
                <Input
                  label={t('Search')}
                  elementType="input"
                  elementConfig={{
                    type: 'text',
                    placeholder: t('Search'),
                  }}
                  value={globalFilter}
                  changed={setGlobalFilter}
                />
              </div>
              <Button
                name={t('Add new project')}
                isSquare
                outline="false"
                color="blue"
                clicked={() => {
                  setShowEditModal(true);
                  setIsUpdating(false);
                  setName('');
                  setEnSmallDescription('');
                  setFrSmallDescription('');
                  setRwSmallDescription('');
                  setEnDescription('');
                  setFrDescription('');
                  setRwDescription('');
                  setIsMain(false);
                  setStartDate(new Date());
                  setEndDate(new Date());
                  setError(null);
                }}
              />
            </div>
            <table {...getTableProps()} className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-red text-white">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps)}
                        className="border border-gray-500 p-2 text-center"
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className="odd:bg-white even:bg-gray-100"
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="border border-gray-500 p-2 text-center"
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex space-x-2 justify-center py-2 items-end">
              <button
                className="cursor-pointer"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <MdSkipPrevious size={20} color="#751E17" />
              </button>
              <span>
                page {pageIndex + 1} of {pageOptions.length}
              </span>
              <button
                className="cursor-pointer"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <MdSkipNext size={20} color="#751E17" />
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProjectsAuthor;

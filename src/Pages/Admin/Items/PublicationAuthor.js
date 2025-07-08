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
  MdRemoveCircle,
} from 'react-icons/md';
import FileUpload from '../../../components/UI/FileUpload';
import axios from '../../../axios-base';
import { Button } from '../../../components/UI/button';
import RichTextEditor from '../../../components/UI/RichTextEditor';
import { useFetchAllPublicationsQuery } from '../../../features/API/admin-api-slice';

const PublicationsAuthor = () => {
  const { t } = useTranslation();
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const token = useSelector((state) => state.global.token);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data, isFetching, refetch } = useFetchAllPublicationsQuery();
  const [enTitle, setEnTitle] = useState('');
  const [frTitle, setFrTitle] = useState('');
  const [rwTitle, setRwTitle] = useState('');
  const [enDescription, setEnDescription] = useState('');
  const [frDescription, setFrDescription] = useState('');
  const [rwDescription, setRwDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [publicationId, setPublicationId] = useState('');

  const updateForm = useCallback(
    (publicationId) => {
      setLoading(true);
      axios
        .get(`/api/publications/${publicationId}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setEnTitle(res.data.results.title.en);
          setFrTitle(res.data.results.title.fr);
          setRwTitle(res.data.results.title.rw);
          setEnDescription(res.data.results.description.en);
          setFrDescription(res.data.results.description.fr);
          setRwDescription(res.data.results.description.rw);
          setTags(res.data.results.tags);
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
              title: project.title[selectedLanguage],
              updatedBy: project.updatedBy.name,
              updatedAt: project.updatedAt,
              status: project.isActive,
              _id: project._id,
            };
          })
        : [],
    [data, selectedLanguage]
  );
  const columns = useMemo(
    () => [
      { Header: 'N0', accessor: 'id' },
      { Header: 'Title', accessor: 'title' },
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
        Header: 'Actions',
        accessor: '_id',
        Cell: ({ value }) => {
          return (
            <div className="flex space-x-2 justify-center">
              <button
                className="border border-gray-500 rounded-md p-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setPublicationId(value);
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
                  setPublicationId(value);
                  setError(null);
                }}
              >
                <MdArchive />
              </button>
              <button
                className="border border-gray-500 rounded-md p-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setShowDeleteModal(true);
                  setPublicationId(value);
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
      enTitle !== '' &&
      frTitle !== '' &&
      rwTitle !== '' &&
      enDescription !== '' &&
      frDescription !== '' &&
      rwDescription !== '' &&
      selectedFiles != null
    ) {
      setLoading(true);
      setShowProgressBar(true);
      setError(null);
      const formData = new FormData();
      formData.append('enTitle', enTitle);
      formData.append('frTitle', frTitle);
      formData.append('rwTitle', rwTitle);
      formData.append('enDescription', enDescription);
      formData.append('frDescription', frDescription);
      formData.append('rwDescription', rwDescription);
      formData.append('tags', JSON.stringify(tags));
      for (let file in selectedFiles) {
        formData.append('images', selectedFiles[file]);
      }
      axios
        .post('/api/publications/add', formData, {
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
    enTitle,
    frTitle,
    rwTitle,
    enDescription,
    frDescription,
    rwDescription,
    tags,
    selectedFiles,
    token,
    t,
    refetch,
  ]);

  const handleUpdate = useCallback(() => {
    if (
      enTitle !== '' &&
      frTitle !== '' &&
      rwTitle !== '' &&
      enDescription !== '' &&
      frDescription !== '' &&
      rwDescription !== ''
    ) {
      setLoading(true);
      setShowProgressBar(true);
      setError(null);
      const formData = new FormData();
      formData.append('enTitle', enTitle);
      formData.append('frTitle', frTitle);
      formData.append('rwTitle', rwTitle);
      formData.append('enDescription', enDescription);
      formData.append('frDescription', frDescription);
      formData.append('rwDescription', rwDescription);
      formData.append('tags', JSON.stringify(tags));
      if (selectedFiles) {
        for (let file in selectedFiles) {
          formData.append('images', selectedFiles[file]);
        }
      }
      axios
        .patch(`/api/publications/${publicationId}`, formData, {
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
    enTitle,
    frTitle,
    rwTitle,
    enDescription,
    frDescription,
    rwDescription,
    tags,
    selectedFiles,
    token,
    t,
    refetch,
    publicationId,
  ]);

  const handleArchive = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .patch(`/api/publications/archive/${publicationId}`, null, {
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
  }, [token, publicationId, refetch]);

  const handleDelete = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .delete(`/api/publications/${publicationId}`, {
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
  }, [token, publicationId, refetch]);

  const handleTags = () => {
    if (tag !== '' && !tags.includes('tags')) {
      const newTags = tags;
      newTags.push(tag);
      setTags(newTags);
    }
    setTag('');
  };

  return (
    <div>
      <Modal
        show={showEditModal}
        modalClosed={(e) => {
          setShowEditModal(false);
        }}
      >
        <CardTitle
          name={`${
            isUpdating ? t('Update publications') : t('Add new publications')
          }`}
          color="red"
        />
        <div className="flex space-x-2">
          <Input
            label={t('English title')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('English title'),
            }}
            value={enTitle}
            changed={setEnTitle}
            validation={{ required: true, maxLength: 500 }}
            shouldValidate
            error={t(
              'English title is required and should be less than 300 characters'
            )}
          />
          <Input
            label={t('French title')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('French title'),
            }}
            value={frTitle}
            changed={setFrTitle}
            validation={{ required: true, maxLength: 500 }}
            shouldValidate
            error={t(
              'French title is required and should be less than 300 characters'
            )}
          />
          <Input
            label={t('Kinyarwanda title')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('Kinyarwanda title'),
            }}
            value={rwTitle}
            changed={setRwTitle}
            validation={{ required: true, maxLength: 500 }}
            shouldValidate
            error={t(
              'Kinyarwanda title is required and should be less than 300 characters'
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
        <div className="flex space-x-2 items-center">
          <div className="w-1/3">
            <Input
              label={t('Tag')}
              elementType="textarea"
              elementConfig={{
                type: 'text',
                placeholder: t('Tag'),
              }}
              value={tag}
              changed={setTag}
              validation={{ required: true }}
              shouldValidate
              error={t('Tag is required')}
            />
          </div>
          <Button
            name={t('Add')}
            isSquare
            outline="false"
            color="blue"
            clicked={handleTags}
          />
          {tags.map((tag, index) => (
            <>
              <MdRemoveCircle
                className="cursor-pointer"
                color="#751E17"
                onClick={() => {
                  const newTags = tags.filter(
                    (clickedTag) => clickedTag !== tag
                  );
                  setTags(newTags);
                }}
              />
              {tag}
            </>
          ))}
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
          clicked={isUpdating ? () => handleUpdate(publicationId) : handleAdd}
        />
      </Modal>
      <Modal
        show={showArchiveModal}
        small
        modalClosed={(e) => {
          setShowArchiveModal(false);
        }}
      >
        <CardTitle name={t('Archive publications')} color="red" />
        <CardBody
          name={t(
            'Are you sure you want to archive/unarchive this publications?'
          )}
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
        <CardTitle name={t('Delete publications')} color="red" />
        <CardBody
          name={`${t('Are you sure you want to delete this publications?')} ${t(
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
        <SectionTitle name={t('List of all Publications')} />
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
                name={t('Add new publication')}
                isSquare
                outline="false"
                color="blue"
                clicked={() => {
                  setShowEditModal(true);
                  setIsUpdating(false);
                  setEnTitle('');
                  setFrTitle('');
                  setRwTitle('');
                  setEnDescription('');
                  setFrDescription('');
                  setRwDescription('');
                  setTags([]);
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

export default PublicationsAuthor;

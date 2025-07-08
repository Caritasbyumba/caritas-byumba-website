import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../../../components/containers/Footer';
import Header from '../../../components/containers/Header';
import { CardBody, CardTitle, SectionTitle } from '../../../components/text';
import Spinner from '../../../components/UI/spinner';
import {
  useFetchAllPartnersQuery,
} from '../../../features/API/admin-api-slice';
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

const PartnersAuthor = () => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.global.token);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data, isFetching, refetch } = useFetchAllPartnersQuery();
  const [name, setName] = useState('');
  const [enQuote, setEnQuote] = useState('');
  const [frQuote, setFrQuote] = useState('');
  const [rwQuote, setRwQuote] = useState('');
  const [enDescription, setEnDescription] = useState('');
  const [frDescription, setFrDescription] = useState('');
  const [rwDescription, setRwDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [partnerId, setPartnerId] = useState('');

  const updateForm = useCallback(
    (partnerId) => {
      setLoading(true);
      axios
        .get(`/api/partners/${partnerId}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setName(res.data.results.name);
          setEnQuote(res.data.results.quote.en);
          setFrQuote(res.data.results.quote.fr);
          setRwQuote(res.data.results.quote.rw);
          setEnDescription(res.data.results.description.en);
          setFrDescription(res.data.results.description.fr);
          setRwDescription(res.data.results.description.rw);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(err.response.data);
        });
    },
    [token]
  );
  const myData = useMemo(
    () =>
      data?.results
        ? data.results.map((partner, index) => {
            return {
              id: index + 1,
              name: partner.name,
              updatedBy: partner.updatedBy.name,
              updatedAt: partner.updatedAt,
              status: partner.isActive,
              _id: partner._id,
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
        Header: 'Actions',
        accessor: '_id',
        Cell: ({ value }) => {
          return (
            <div className="flex space-x-2 justify-center">
              <button
                className="border border-gray-500 rounded-md p-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setPartnerId(value);
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
                  setPartnerId(value);
                  setError(null);
                }}
              >
                <MdArchive />
              </button>
              <button
                className="border border-gray-500 rounded-md p-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setShowDeleteModal(true);
                  setPartnerId(value);
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
      enQuote !== '' &&
      frQuote !== '' &&
      rwQuote !== '' &&
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
      formData.append('enQuote', enQuote);
      formData.append('frQuote', frQuote);
      formData.append('rwQuote', rwQuote);
      formData.append('enDescription', enDescription);
      formData.append('frDescription', frDescription);
      formData.append('rwDescription', rwDescription);
      if (selectedFiles) {
        formData.append('image', selectedFiles[0]);
      }
      axios
        .post('/api/partners/add', formData, {
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
    enQuote,
    frQuote,
    rwQuote,
    enDescription,
    frDescription,
    rwDescription,
    selectedFiles,
    token,
    t,
    refetch,
  ]);

  const handleUpdate = useCallback(() => {
    if (
      name !== '' &&
      enQuote !== '' &&
      frQuote !== '' &&
      rwQuote !== '' &&
      enDescription !== '' &&
      frDescription !== '' &&
      rwDescription !== ''
    ) {
      setLoading(true);
      setShowProgressBar(true);
      setError(null);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('enQuote', enQuote);
      formData.append('frQuote', frQuote);
      formData.append('rwQuote', rwQuote);
      formData.append('enDescription', enDescription);
      formData.append('frDescription', frDescription);
      formData.append('rwDescription', rwDescription);
      if (selectedFiles) {
        formData.append('image', selectedFiles[0]);
      }
      axios
        .patch(`/api/partners/${partnerId}`, formData, {
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
    enQuote,
    frQuote,
    rwQuote,
    enDescription,
    frDescription,
    rwDescription,
    selectedFiles,
    token,
    t,
    refetch,
    partnerId,
  ]);

  const handleArchive = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .patch(`/api/partners/archive/${partnerId}`, null, {
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
  }, [token, partnerId, refetch]);

  const handleDelete = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .delete(`/api/partners/${partnerId}`, {
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
  }, [token, partnerId, refetch]);

  return (
    <div>
      <Modal
        show={showEditModal}
        modalClosed={(e) => {
          setShowEditModal(false);
        }}
      >
        <CardTitle
          name={`${isUpdating ? t('Update partner') : t('Add new partner')}`}
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
            label={t('English Description')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('English Description'),
            }}
            value={enDescription}
            changed={setEnDescription}
            validation={{ required: true }}
            shouldValidate
            error={t('English Description is required')}
          />
          <Input
            label={t('French Description')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('French Description'),
            }}
            value={frDescription}
            changed={setFrDescription}
            validation={{ required: true }}
            shouldValidate
            error={t('French Description is required')}
          />
          <Input
            label={t('Kinyarwanda Description')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('Kinyarwanda Description'),
            }}
            value={rwDescription}
            changed={setRwDescription}
            validation={{ required: true }}
            shouldValidate
            error={t('Kinyarwanda Description is required')}
          />
        </div>

        <div className="flex space-x-2">
          <Input
            label={t('English quote')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('English quote'),
            }}
            value={enQuote}
            changed={setEnQuote}
            validation={{ required: true }}
            shouldValidate
            error={t('English quote is required')}
          />
          <Input
            label={t('French quote')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('French quote'),
            }}
            value={frQuote}
            changed={setFrQuote}
            validation={{ required: true }}
            shouldValidate
            error={t('French quote is required')}
          />
          <Input
            label={t('Kinyarwanda quote')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('Kinyarwanda quote'),
            }}
            value={rwQuote}
            changed={setRwQuote}
            validation={{ required: true }}
            shouldValidate
            error={t('Kinyarwanda quote is required')}
          />
        </div>
        <FileUpload
          elementConfig={{
            accept: 'image/*',
          }}
          btnName="Upload image"
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
          clicked={isUpdating ? () => handleUpdate(partnerId) : handleAdd}
        />
      </Modal>
      <Modal
        show={showArchiveModal}
        small
        modalClosed={(e) => {
          setShowArchiveModal(false);
        }}
      >
        <CardTitle name={t('Archive carousel')} color="red" />
        <CardBody
          name={t('Are you sure you want to archive/unarchive this partner?')}
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
        <CardTitle name={t('Delete carousel')} color="red" />
        <CardBody
          name={`${t('Are you sure you want to delete this partner?')} ${t(
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
        <SectionTitle name={t('List of all partners')} />
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
                name={t('Add new partner')}
                isSquare
                outline="false"
                color="blue"
                clicked={() => {
                  setShowEditModal(true);
                  setIsUpdating(false);
                  setName('');
                  setEnQuote('');
                  setFrQuote('');
                  setRwQuote('');
                  setEnDescription('');
                  setFrDescription('');
                  setRwDescription('');
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

export default PartnersAuthor;

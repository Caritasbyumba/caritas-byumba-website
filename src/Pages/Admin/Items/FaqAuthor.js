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
import axios from '../../../axios-base';
import { Button } from '../../../components/UI/button';
import { useFetchAllFaqsQuery } from '../../../features/API/admin-api-slice';

const FaqAuthor = () => {
  const { t } = useTranslation();
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const token = useSelector((state) => state.global.token);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data, isFetching, refetch } = useFetchAllFaqsQuery();
  const [enQuestion, setEnQuestion] = useState('');
  const [frQuestion, setFrQuestion] = useState('');
  const [rwQuestion, setRwQuestion] = useState('');
  const [enAnswer, setEnAnswer] = useState('');
  const [frAnswer, setFrAnswer] = useState('');
  const [rwAnswer, setRwAnswer] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [faqId, setFaqId] = useState('');

  const updateForm = useCallback(
    (faqId) => {
      setLoading(true);
      axios
        .get(`/api/faqs/${faqId}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setEnQuestion(res.data.results.question.en);
          setFrQuestion(res.data.results.question.fr);
          setRwQuestion(res.data.results.question.rw);
          setEnAnswer(res.data.results.answer.en);
          setFrAnswer(res.data.results.answer.fr);
          setRwAnswer(res.data.results.answer.rw);
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
        ? data.results.map((faq, index) => {
            return {
              id: index + 1,
              question: faq.question[selectedLanguage],
              updatedBy: faq.updatedBy.name,
              updatedAt: faq.updatedAt,
              status: faq.isActive,
              _id: faq._id,
            };
          })
        : [],
    [data, selectedLanguage]
  );
  const columns = useMemo(
    () => [
      { Header: 'N0', accessor: 'id' },
      { Header: 'Question', accessor: 'question' },
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
                  setFaqId(value);
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
                  setFaqId(value);
                  setError(null);
                }}
              >
                <MdArchive />
              </button>
              <button
                className="border border-gray-500 rounded-md p-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setShowDeleteModal(true);
                  setFaqId(value);
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
      enQuestion !== '' &&
      frQuestion !== '' &&
      rwQuestion !== '' &&
      enAnswer !== '' &&
      frAnswer !== '' &&
      rwAnswer !== ''
    ) {
      setLoading(true);
      setError(null);
      const formData = {
        enQuestion,
        frQuestion,
        rwQuestion,
        enAnswer,
        frAnswer,
        rwAnswer,
      };
      axios
        .post('/api/faqs/add', formData, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setLoading(false);
          setShowEditModal(false);
          refetch();
        })
        .catch((err) => {
          setLoading(false);
          setError(err.response.data);
        });
    } else {
      setError({ error: t('All fields must be filled') });
    }
  }, [
    enQuestion,
    frQuestion,
    rwQuestion,
    enAnswer,
    frAnswer,
    rwAnswer,
    token,
    t,
    refetch,
  ]);

  const handleUpdate = useCallback(() => {
    if (
      enQuestion !== '' &&
      frQuestion !== '' &&
      rwQuestion !== '' &&
      enAnswer !== '' &&
      frAnswer !== '' &&
      rwAnswer !== ''
    ) {
      setLoading(true);
      setError(null);
      const formData = {
        enQuestion,
        frQuestion,
        rwQuestion,
        enAnswer,
        frAnswer,
        rwAnswer,
      };
      axios
        .patch(`/api/faqs/${faqId}`, formData, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setLoading(false);
          setShowEditModal(false);
          refetch();
        })
        .catch((err) => {
          setLoading(false);
          setError(err.response.data);
        });
    } else {
      setError({ error: t('All fields must be filled') });
    }
  }, [
    enQuestion,
    frQuestion,
    rwQuestion,
    enAnswer,
    frAnswer,
    rwAnswer,
    token,
    t,
    refetch,
    faqId,
  ]);

  const handleArchive = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .patch(`/api/faqs/archive/${faqId}`, null, {
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
  }, [token, faqId, refetch]);

  const handleDelete = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .delete(`/api/faqs/${faqId}`, {
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
  }, [token, faqId, refetch]);

  return (
    <div>
      <Modal
        show={showEditModal}
        modalClosed={(e) => {
          setShowEditModal(false);
        }}
      >
        <CardTitle
          name={`${isUpdating ? t('Update faq') : t('Add new faq')}`}
          color="red"
        />

        <div className="flex space-x-2">
          <Input
            label={t('English question')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('English question'),
            }}
            value={enQuestion}
            changed={setEnQuestion}
            validation={{ required: true, maxLength: 50 }}
            shouldValidate
            error={t(
              'English question is required and should be less than 50 characters'
            )}
          />
          <Input
            label={t('French question')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('French question'),
            }}
            value={frQuestion}
            changed={setFrQuestion}
            validation={{ required: true, maxLength: 50 }}
            shouldValidate
            error={t(
              'French question is required and should be less than 50 characters'
            )}
          />
          <Input
            label={t('Kinyarwanda question')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('Kinyarwanda question'),
            }}
            value={rwQuestion}
            changed={setRwQuestion}
            validation={{ required: true, maxLength: 50 }}
            shouldValidate
            error={t(
              'Kinyarwanda question is required and should be less than 50 characters'
            )}
          />
        </div>
        <div className="flex space-x-2">
          <Input
            label={t('English answer')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('English answer'),
            }}
            value={enAnswer}
            changed={setEnAnswer}
            validation={{ required: true }}
            shouldValidate
            error={t('English answer is required')}
          />
          <Input
            label={t('French answer')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('French answer'),
            }}
            value={frAnswer}
            changed={setFrAnswer}
            validation={{ required: true }}
            shouldValidate
            error={t('French answer is required')}
          />
          <Input
            label={t('Kinyarwanda answer')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('Kinyarwanda answer'),
            }}
            value={rwAnswer}
            changed={setRwAnswer}
            validation={{ required: true }}
            shouldValidate
            error={t('Kinyarwanda answer is required')}
          />
        </div>
        {loading && <Spinner />}
        {error && (
          <CardBody name={error.error} color="red" additional="font-semibold" />
        )}
        <Button
          name={t('Submit')}
          isSquare
          outline="false"
          color="red"
          additional="mt-3"
          clicked={isUpdating ? () => handleUpdate(faqId) : handleAdd}
        />
      </Modal>
      <Modal
        show={showArchiveModal}
        small
        modalClosed={(e) => {
          setShowArchiveModal(false);
        }}
      >
        <CardTitle name={t('Archive faqs')} color="red" />
        <CardBody
          name={t('Are you sure you want to archive/unarchive this faqs?')}
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
        <CardTitle name={t('Delete faq')} color="red" />
        <CardBody
          name={`${t('Are you sure you want to delete this faq?')} ${t(
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
        <SectionTitle name={t('List of all faq')} />
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
                name={t('Add new faq')}
                isSquare
                outline="false"
                color="blue"
                clicked={() => {
                  setShowEditModal(true);
                  setIsUpdating(false);
                  setEnQuestion('');
                  setFrQuestion('');
                  setRwQuestion('');
                  setEnAnswer('');
                  setFrAnswer('');
                  setRwAnswer('');
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

export default FaqAuthor;

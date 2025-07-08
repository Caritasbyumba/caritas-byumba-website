import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../../../components/containers/Footer';
import Header from '../../../components/containers/Header';
import { CardBody, CardTitle, SectionTitle } from '../../../components/text';
import Spinner from '../../../components/UI/spinner';
import { useFetchAllAboutusQuery } from '../../../features/API/admin-api-slice';
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

const AboutusAuthor = () => {
  const { t } = useTranslation();
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const token = useSelector((state) => state.global.token);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data, isFetching, refetch } = useFetchAllAboutusQuery();
  const [enName, setEnName] = useState('');
  const [frName, setFrName] = useState('');
  const [rwName, setRwName] = useState('');
  const [enDescription, setEnDescription] = useState('');
  const [frDescription, setFrDescription] = useState('');
  const [rwDescription, setRwDescription] = useState('');
  const [enVision, setEnVision] = useState('');
  const [frVision, setFrVision] = useState('');
  const [rwVision, setRwVision] = useState('');
  const [enMission, setEnMission] = useState('');
  const [frMission, setFrMission] = useState('');
  const [rwMission, setRwMission] = useState('');
  const [enObjectives, setEnObjectives] = useState('');
  const [frObjectives, setFrObjectives] = useState('');
  const [rwObjectives, setRwObjectives] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aboutusId, setAboutusId] = useState('');

  const updateForm = useCallback(
    (aboutusId) => {
      setLoading(true);
      axios
        .get(`/api/aboutus/${aboutusId}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setEnName(res.data.results.name.en);
          setFrName(res.data.results.name.fr);
          setRwName(res.data.results.name.rw);
          setEnDescription(res.data.results.description.en);
          setFrDescription(res.data.results.description.fr);
          setRwDescription(res.data.results.description.rw);
          setEnVision(res.data.results.vision.en);
          setFrVision(res.data.results.vision.fr);
          setRwVision(res.data.results.vision.rw);
          setEnMission(res.data.results.mission.en);
          setFrMission(res.data.results.mission.fr);
          setRwMission(res.data.results.mission.rw);
          setEnObjectives(res.data.results.objectives.en);
          setFrObjectives(res.data.results.objectives.fr);
          setRwObjectives(res.data.results.objectives.rw);
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
        ? data.results.map((aboutus, index) => {
            return {
              id: index + 1,
              description: aboutus.description[selectedLanguage],
              updatedBy: aboutus.updatedBy.name,
              updatedAt: aboutus.updatedAt,
              status: aboutus.isActive,
              _id: aboutus._id,
            };
          })
        : [],
    [data, selectedLanguage]
  );
  const columns = useMemo(
    () => [
      { Header: 'N0', accessor: 'id' },
      { Header: 'Description', accessor: 'description' },
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
                  setAboutusId(value);
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
                  setAboutusId(value);
                  setError(null);
                }}
              >
                <MdArchive />
              </button>
              <button
                className="border border-gray-500 rounded-md p-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setShowDeleteModal(true);
                  setAboutusId(value);
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
      enName !== '' &&
      frName !== '' &&
      rwName !== '' &&
      enDescription !== '' &&
      frDescription !== '' &&
      rwDescription !== '' &&
      enVision !== '' &&
      frVision !== '' &&
      rwVision !== '' &&
      enMission !== '' &&
      frMission !== '' &&
      rwMission !== '' &&
      enObjectives !== '' &&
      frObjectives !== '' &&
      rwObjectives !== ''
    ) {
      setLoading(true);
      setError(null);
      const formData = {
        enName,
        frName,
        rwName,
        enDescription,
        frDescription,
        rwDescription,
        enVision,
        frVision,
        rwVision,
        enMission,
        frMission,
        rwMission,
        enObjectives,
        frObjectives,
        rwObjectives,
      };
      axios
        .post('/api/aboutus/add', formData, {
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
    enName,
    frName,
    rwName,
    enDescription,
    frDescription,
    rwDescription,
    enVision,
    frVision,
    rwVision,
    enMission,
    frMission,
    rwMission,
    enObjectives,
    frObjectives,
    rwObjectives,
    token,
    t,
    refetch,
  ]);

  const handleUpdate = useCallback(() => {
    if (
      enName !== '' &&
      frName !== '' &&
      rwName !== '' &&
      enDescription !== '' &&
      frDescription !== '' &&
      rwDescription !== '' &&
      enVision !== '' &&
      frVision !== '' &&
      rwVision !== '' &&
      enMission !== '' &&
      frMission !== '' &&
      rwMission !== '' &&
      enObjectives !== '' &&
      frObjectives !== '' &&
      rwObjectives !== ''
    ) {
      setLoading(true);
      setError(null);
      const formData = {
        enName,
        frName,
        rwName,
        enDescription,
        frDescription,
        rwDescription,
        enVision,
        frVision,
        rwVision,
        enMission,
        frMission,
        rwMission,
        enObjectives,
        frObjectives,
        rwObjectives,
      };
      axios
        .patch(`/api/aboutus/${aboutusId}`, formData, {
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
    enName,
    frName,
    rwName,
    enDescription,
    frDescription,
    rwDescription,
    enVision,
    frVision,
    rwVision,
    enMission,
    frMission,
    rwMission,
    enObjectives,
    frObjectives,
    rwObjectives,
    token,
    t,
    refetch,
    aboutusId,
  ]);

  const handleArchive = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .patch(`/api/aboutus/archive/${aboutusId}`, null, {
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
  }, [token, aboutusId, refetch]);

  const handleDelete = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .delete(`/api/aboutus/${aboutusId}`, {
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
  }, [token, aboutusId, refetch]);

  return (
    <div>
      <Modal
        show={showEditModal}
        modalClosed={(e) => {
          setShowEditModal(false);
        }}
      >
        <CardTitle
          name={`${isUpdating ? t('Update About us') : t('Add new About us')}`}
          color="red"
        />
        <div className="flex space-x-2">
          <Input
            label={t('English name')}
            elementType="input"
            elementConfig={{
              type: 'text',
              placeholder: t('English name'),
            }}
            value={enName}
            changed={setEnName}
            validation={{ required: true, maxLength: 50 }}
            shouldValidate
            error={t(
              'English name is required and should be less than 50 characters'
            )}
          />
          <Input
            label={t('French name')}
            elementType="input"
            elementConfig={{
              type: 'text',
              placeholder: t('French name'),
            }}
            value={frName}
            changed={setFrName}
            validation={{ required: true, maxLength: 50 }}
            shouldValidate
            error={t(
              'French name is required and should be less than 50 characters'
            )}
          />
          <Input
            label={t('Kinyarwanda name')}
            elementType="input"
            elementConfig={{
              type: 'text',
              placeholder: t('Kinyarwanda name'),
            }}
            value={rwName}
            changed={setRwName}
            validation={{ required: true, maxLength: 50 }}
            shouldValidate
            error={t(
              'Kinyarwanda name is required and should be less than 50 characters'
            )}
          />
        </div>
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
            label={t('English Vision')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('English Vision'),
            }}
            value={enVision}
            changed={setEnVision}
            validation={{ required: true }}
            shouldValidate
            error={t('English Vision is required')}
          />
          <Input
            label={t('French Vision')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('French Vision'),
            }}
            value={frVision}
            changed={setFrVision}
            validation={{ required: true }}
            shouldValidate
            error={t('French Vision is required')}
          />
          <Input
            label={t('Kinyarwanda Vision')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('Kinyarwanda Vision'),
            }}
            value={rwVision}
            changed={setRwVision}
            validation={{ required: true }}
            shouldValidate
            error={t('Kinyarwanda Vision is required')}
          />
        </div>
        <div className="flex space-x-2">
          <Input
            label={t('English Mission')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('English Mission'),
            }}
            value={enMission}
            changed={setEnMission}
            validation={{ required: true }}
            shouldValidate
            error={t('English Mission is required')}
          />
          <Input
            label={t('French Mission')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('French Mission'),
            }}
            value={frMission}
            changed={setFrMission}
            validation={{ required: true }}
            shouldValidate
            error={t('French Mission is required')}
          />
          <Input
            label={t('Kinyarwanda Mission')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('Kinyarwanda Mission'),
            }}
            value={rwMission}
            changed={setRwMission}
            validation={{ required: true }}
            shouldValidate
            error={t('Kinyarwanda Mission is required')}
          />
        </div>
        <div className="flex space-x-2">
          <Input
            label={t('English Objectives')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('English Objectives'),
            }}
            value={enObjectives}
            changed={setEnObjectives}
            validation={{ required: true }}
            shouldValidate
            error={t('English Objectives is required')}
          />
          <Input
            label={t('French Objectives')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('French Objectives'),
            }}
            value={frObjectives}
            changed={setFrObjectives}
            validation={{ required: true }}
            shouldValidate
            error={t('French Objectives is required')}
          />
          <Input
            label={t('Kinyarwanda Objectives')}
            elementType="textarea"
            elementConfig={{
              type: 'text',
              placeholder: t('Kinyarwanda Objectives'),
            }}
            value={rwObjectives}
            changed={setRwObjectives}
            validation={{ required: true }}
            shouldValidate
            error={t('Kinyarwanda Objectives is required')}
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
          clicked={isUpdating ? () => handleUpdate(aboutusId) : handleAdd}
        />
      </Modal>
      <Modal
        show={showArchiveModal}
        small
        modalClosed={(e) => {
          setShowArchiveModal(false);
        }}
      >
        <CardTitle name={t('Archive about us')} color="red" />
        <CardBody
          name={t('Are you sure you want to archive/unarchive this about us?')}
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
        <CardTitle name={t('Delete about us')} color="red" />
        <CardBody
          name={`${t('Are you sure you want to delete this about us?')} ${t(
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
        <SectionTitle name={t('List of all about us')} />
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
                name={t('Add new about us')}
                isSquare
                outline="false"
                color="blue"
                clicked={() => {
                  setShowEditModal(true);
                  setIsUpdating(false);
                  setEnName('');
                  setFrName('');
                  setRwName('');
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

export default AboutusAuthor;

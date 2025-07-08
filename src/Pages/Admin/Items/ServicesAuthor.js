import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../../../components/containers/Footer";
import Header from "../../../components/containers/Header";
import { CardBody, CardTitle, SectionTitle } from "../../../components/text";
import Spinner from "../../../components/UI/spinner";
import {
  useFetchAllDepartmentsQuery,
  useFetchAllServicesQuery,
} from "../../../features/API/admin-api-slice";
import { useSelector } from "react-redux";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import Input from "../../../components/UI/input";
import Modal from "../../../components/UI/modal";
import {
  MdSkipPrevious,
  MdSkipNext,
  MdEdit,
  MdDelete,
  MdArchive,
} from "react-icons/md";
import axios from "../../../axios-base";
import { Button } from "../../../components/UI/button";
import RichTextEditor from "../../../components/UI/RichTextEditor";
import FileUpload from "../../../components/UI/FileUpload";

const ServiceAuthor = () => {
  const { t } = useTranslation();
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const token = useSelector((state) => state.global.token);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data, isFetching, refetch } = useFetchAllServicesQuery();
  const { data: allDepartments } = useFetchAllDepartmentsQuery();
  const [name, setName] = useState("");
  const [enSmallDescription, setEnSmallDescription] = useState("");
  const [frSmallDescription, setFrSmallDescription] = useState("");
  const [rwSmallDescription, setRwSmallDescription] = useState("");
  const [enChallenges, setEnChallenges] = useState("");
  const [frChallenges, setFrChallenges] = useState("");
  const [rwChallenges, setRwChallenges] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceId, setServiceId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [department, setDepartment] = useState("");

  const updateForm = useCallback(
    (serviceId) => {
      setLoading(true);
      axios
        .get(`/api/services/${serviceId}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setName(res.data.results.name);
          setEnSmallDescription(res.data.results.smallDescription.en);
          setFrSmallDescription(res.data.results.smallDescription.fr);
          setRwSmallDescription(res.data.results.smallDescription.rw);
          setEnChallenges(res.data.results.challenges.en);
          setFrChallenges(res.data.results.challenges.fr);
          setRwChallenges(res.data.results.challenges.rw);
          setDepartment(res.data.results.department?._id);
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
        ? data.results.map((service, index) => {
            return {
              id: index + 1,
              name: service.name,
              updatedBy: service.updatedBy
                ? service.updatedBy.name
                : service.createdBy.name,
              updatedAt: service.updatedAt,
              status: service.isActive,
              _id: service._id,
            };
          })
        : [],
    [data]
  );
  const columns = useMemo(
    () => [
      { Header: "N0", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "UpdatedBy", accessor: "updatedBy" },
      {
        Header: "UpdatedAt",
        accessor: "updatedAt",
        Cell: ({ value }) => {
          return new Date(value).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          return value ? "Active" : "Inactive";
        },
      },
      {
        Header: "Actions",
        accessor: "_id",
        Cell: ({ value }) => {
          return (
            <div className="flex space-x-2 justify-center">
              <button
                className="border border-gray-500 rounded-md p-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setServiceId(value);
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
                  setServiceId(value);
                  setError(null);
                }}
              >
                <MdArchive />
              </button>
              <button
                className="border border-gray-500 rounded-md p-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setShowDeleteModal(true);
                  setServiceId(value);
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
      name !== "" &&
      enSmallDescription !== "" &&
      frSmallDescription !== "" &&
      rwSmallDescription !== "" &&
      enChallenges !== "" &&
      frChallenges !== "" &&
      rwChallenges !== "" &&
      selectedFiles != null
    ) {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("enSmallDescription", enSmallDescription);
      formData.append("frSmallDescription", frSmallDescription);
      formData.append("rwSmallDescription", rwSmallDescription);
      formData.append("enChallenges", enChallenges);
      formData.append("frChallenges", frChallenges);
      formData.append("rwChallenges", rwChallenges);
      formData.append("department", department);
      if (selectedFiles) {
        formData.append("image", selectedFiles[0]);
      }
      axios
        .post("/api/services/add", formData, {
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
      setError({ error: t("All fields must be filled") });
    }
  }, [
    name,
    enSmallDescription,
    frSmallDescription,
    rwSmallDescription,
    enChallenges,
    frChallenges,
    rwChallenges,
    selectedFiles,
    department,
    token,
    t,
    refetch,
  ]);

  const handleUpdate = useCallback(() => {
    if (
      name !== "" &&
      enSmallDescription !== "" &&
      frSmallDescription !== "" &&
      rwSmallDescription !== "" &&
      enChallenges !== "" &&
      frChallenges !== "" &&
      rwChallenges !== ""
    ) {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("enSmallDescription", enSmallDescription);
      formData.append("frSmallDescription", frSmallDescription);
      formData.append("rwSmallDescription", rwSmallDescription);
      formData.append("enChallenges", enChallenges);
      formData.append("frChallenges", frChallenges);
      formData.append("rwChallenges", rwChallenges);
      formData.append("department", department);
      if (selectedFiles) {
        formData.append("image", selectedFiles[0]);
      }
      axios
        .patch(`/api/services/${serviceId}`, formData, {
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
      setError({ error: t("All fields must be filled") });
    }
  }, [
    name,
    enSmallDescription,
    frSmallDescription,
    rwSmallDescription,
    enChallenges,
    frChallenges,
    rwChallenges,
    selectedFiles,
    department,
    token,
    t,
    refetch,
    serviceId,
  ]);

  const handleArchive = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .patch(`/api/services/archive/${serviceId}`, null, {
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
  }, [token, serviceId, refetch]);

  const handleDelete = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .delete(`/api/services/${serviceId}`, {
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
  }, [token, serviceId, refetch]);

  return (
    <div>
      <Modal
        show={showEditModal}
        modalClosed={(e) => {
          setShowEditModal(false);
        }}
      >
        <CardTitle
          name={`${isUpdating ? t("Update service") : t("Add new service")}`}
          color="red"
        />
        <Input
          label={t("Name")}
          elementType="input"
          elementConfig={{
            type: "text",
            placeholder: t("Name"),
          }}
          value={name}
          changed={setName}
          validation={{ required: true, maxLength: 100 }}
          shouldValidate
          error={t("Name is required and should be less than 100 characters")}
        />
        <RichTextEditor
          label={t("English Small Description")}
          value={enSmallDescription}
          onChange={(text) => setEnSmallDescription(text)}
          placeholder={t("English Small Description")}
        />
        <RichTextEditor
          label={t("French Small Description")}
          value={frSmallDescription}
          onChange={(text) => setFrSmallDescription(text)}
          placeholder={t("French Small Description")}
        />
        <RichTextEditor
          label={t("Kinyarwanda Small Description")}
          value={rwSmallDescription}
          onChange={(text) => setRwSmallDescription(text)}
          placeholder={t("Kinyarwanda Small Description")}
        />
        <RichTextEditor
          label={t("English Challenges")}
          value={enChallenges}
          onChange={(text) => setEnChallenges(text)}
          placeholder={t("English Challenges")}
        />
        <RichTextEditor
          label={t("French Challenges")}
          value={frChallenges}
          onChange={(text) => setFrChallenges(text)}
          placeholder={t("French Challenges")}
        />
        <RichTextEditor
          label={t("Kinyarwanda Challenges")}
          value={rwChallenges}
          onChange={(text) => setRwChallenges(text)}
          placeholder={t("Kinyarwanda Challenges")}
        />
        {allDepartments && (
          <Input
            label={t("Related department")}
            elementType="select"
            elementConfig={{
              type: "text",
              startingValue: t("SELECT"),
              options: allDepartments?.results?.map((department) => {
                return {
                  value: department._id,
                  displayValue: department.name[selectedLanguage],
                };
              }),
            }}
            value={department}
            changed={setDepartment}
          />
        )}
        <FileUpload
          elementConfig={{
            accept: "image/*",
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
          name={t("Submit")}
          isSquare
          outline="false"
          color="red"
          additional="mt-3"
          clicked={isUpdating ? () => handleUpdate(serviceId) : handleAdd}
        />
      </Modal>
      <Modal
        show={showArchiveModal}
        small
        modalClosed={(e) => {
          setShowArchiveModal(false);
        }}
      >
        <CardTitle name={t("Archive service")} color="red" />
        <CardBody
          name={t("Are you sure you want to archive/unarchive this service?")}
        />
        {loading && <Spinner />}
        {error && (
          <CardBody name={error.error} color="red" additional="font-semibold" />
        )}
        <div className="flex justify-between">
          <Button
            name={t("Cancel")}
            isSquare
            outline="false"
            color="blue"
            clicked={() => setShowArchiveModal(false)}
          />
          <Button
            name={t("Archive/Unarchive")}
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
        <CardTitle name={t("Delete service")} color="red" />
        <CardBody
          name={`${t("Are you sure you want to delete this service?")} ${t(
            "Contents deleted can not be retrieved."
          )}`}
        />
        {loading && <Spinner />}
        {error && (
          <CardBody name={error.error} color="red" additional="font-semibold" />
        )}
        <div className="flex justify-between">
          <Button
            name={t("Cancel")}
            isSquare
            outline="false"
            color="blue"
            clicked={() => setShowDeleteModal(false)}
          />
          <Button
            name={t("Delete")}
            isSquare
            outline="false"
            color="red"
            clicked={handleDelete}
          />
        </div>
      </Modal>
      <Header />
      <div className="w-70% m-auto py-10">
        <SectionTitle name={t("List of all service")} />
        {isFetching ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto relative py-5">
            <div className="flex justify-between items-center">
              <div className="w-1/3 py-3">
                <Input
                  label={t("Search")}
                  elementType="input"
                  elementConfig={{
                    type: "text",
                    placeholder: t("Search"),
                  }}
                  value={globalFilter}
                  changed={setGlobalFilter}
                />
              </div>
              <Button
                name={t("Add new service")}
                isSquare
                outline="false"
                color="blue"
                clicked={() => {
                  setShowEditModal(true);
                  setIsUpdating(false);
                  setName("");
                  setEnSmallDescription("");
                  setFrSmallDescription("");
                  setRwSmallDescription("");
                  setEnChallenges("");
                  setFrChallenges("");
                  setRwChallenges("");
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
                        {column.render("Header")}
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
                            {cell.render("Cell")}
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

export default ServiceAuthor;

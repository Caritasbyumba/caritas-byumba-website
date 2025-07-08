import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../../../components/containers/Footer";
import Header from "../../../components/containers/Header";
import { CardBody, CardTitle, SectionTitle } from "../../../components/text";
import Spinner from "../../../components/UI/spinner";
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
import FileUpload from "../../../components/UI/FileUpload";
import axios from "../../../axios-base";
import { Button } from "../../../components/UI/button";
import { useFetchAllQuotesQuery } from "../../../features/API/admin-api-slice";

const QuotesAuthor = () => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.global.token);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data, isFetching, refetch } = useFetchAllQuotesQuery();
  const [name, setName] = useState("");
  const [enRole, setEnRole] = useState("");
  const [frRole, setFrRole] = useState("");
  const [rwRole, setRwRole] = useState("");
  const [enQuote, setEnQuote] = useState("");
  const [frQuote, setFrQuote] = useState("");
  const [rwQuote, setRwQuote] = useState("");
  const [order, setOrder] = useState(100);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [quoteId, setQuoteId] = useState("");

  const updateForm = useCallback(
    (quoteId) => {
      setLoading(true);
      axios
        .get(`/api/quotes/${quoteId}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setName(res.data.results.name);
          setEnRole(res.data.results.role.en);
          setFrRole(res.data.results.role.fr);
          setRwRole(res.data.results.role.rw);
          setEnQuote(res.data.results.quote.en);
          setFrQuote(res.data.results.quote.fr);
          setRwQuote(res.data.results.quote.rw);
          setOrder(res.data.results.order);
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
        ? data.results.map((carousel, index) => {
            return {
              id: index + 1,
              name: carousel.name,
              updatedBy: carousel.updatedBy
                ? carousel.updatedBy.name
                : carousel.createdBy.name,
              updatedAt: carousel.updatedAt,
              status: carousel.isActive,
              _id: carousel._id,
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
                  setQuoteId(value);
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
                  setQuoteId(value);
                  setError(null);
                }}
              >
                <MdArchive />
              </button>
              <button
                className="border border-gray-500 rounded-md p-0.5 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setShowDeleteModal(true);
                  setQuoteId(value);
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
      enRole !== "" &&
      frRole !== "" &&
      rwRole !== "" &&
      enQuote !== "" &&
      frQuote !== "" &&
      rwQuote !== "" &&
      order !== "" &&
      selectedFiles != null
    ) {
      setLoading(true);
      setShowProgressBar(true);
      setError(null);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("enRole", enRole);
      formData.append("frRole", frRole);
      formData.append("rwRole", rwRole);
      formData.append("enQuote", enQuote);
      formData.append("frQuote", frQuote);
      formData.append("rwQuote", rwQuote);
      formData.append("order", order);
      if (selectedFiles) {
        formData.append("profile", selectedFiles[0]);
      }
      axios
        .post("/api/quotes/add", formData, {
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
    enRole,
    frRole,
    rwRole,
    enQuote,
    frQuote,
    rwQuote,
    order,
    selectedFiles,
    token,
    t,
    refetch,
  ]);

  const handleUpdate = useCallback(() => {
    if (
      name !== "" &&
      enRole !== "" &&
      frRole !== "" &&
      rwRole !== "" &&
      enQuote !== "" &&
      frQuote !== "" &&
      rwQuote !== "" &&
      order !== ""
    ) {
      setLoading(true);
      setShowProgressBar(true);
      setError(null);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("enRole", enRole);
      formData.append("frRole", frRole);
      formData.append("rwRole", rwRole);
      formData.append("enQuote", enQuote);
      formData.append("frQuote", frQuote);
      formData.append("rwQuote", rwQuote);
      formData.append("order", order);
      if (selectedFiles) {
        formData.append("profile", selectedFiles[0]);
      }
      axios
        .patch(`/api/quotes/${quoteId}`, formData, {
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
    enRole,
    frRole,
    rwRole,
    enQuote,
    frQuote,
    rwQuote,
    order,
    selectedFiles,
    token,
    t,
    refetch,
    quoteId,
  ]);

  const handleArchive = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .patch(`/api/quotes/archive/${quoteId}`, null, {
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
  }, [token, quoteId, refetch]);

  const handleDelete = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .delete(`/api/quotes/${quoteId}`, {
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
  }, [token, quoteId, refetch]);

  return (
    <div>
      <Modal
        show={showEditModal}
        modalClosed={(e) => {
          setShowEditModal(false);
        }}
      >
        <CardTitle
          name={`${isUpdating ? t("Update quote") : t("Add new quote")}`}
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
          validation={{ required: true }}
          shouldValidate
          error={t("Name is required")}
        />
        <div className="flex space-x-2">
          <Input
            label={t("English role")}
            elementType="textarea"
            elementConfig={{
              type: "text",
              placeholder: t("English role"),
            }}
            value={enRole}
            changed={setEnRole}
            validation={{ required: true }}
            shouldValidate
            error={t("English role is required")}
          />
          <Input
            label={t("French role")}
            elementType="textarea"
            elementConfig={{
              type: "text",
              placeholder: t("French role"),
            }}
            value={frRole}
            changed={setFrRole}
            validation={{ required: true }}
            shouldValidate
            error={t("French role is required")}
          />
          <Input
            label={t("Kinyarwanda role")}
            elementType="textarea"
            elementConfig={{
              type: "text",
              placeholder: t("Kinyarwanda role"),
            }}
            value={rwRole}
            changed={setRwRole}
            validation={{ required: true }}
            shouldValidate
            error={t("Kinyarwanda role is required")}
          />
        </div>
        <div className="flex space-x-2">
          <Input
            label={t("English Quote")}
            elementType="textarea"
            elementConfig={{
              type: "text",
              placeholder: t("English Quote"),
            }}
            value={enQuote}
            changed={setEnQuote}
            validation={{ required: true }}
            shouldValidate
            error={t("English Quote is required")}
          />
          <Input
            label={t("French Quote")}
            elementType="textarea"
            elementConfig={{
              type: "text",
              placeholder: t("French Quote"),
            }}
            value={frQuote}
            changed={setFrQuote}
            validation={{ required: true }}
            shouldValidate
            error={t("French Quote is required")}
          />
          <Input
            label={t("Kinyarwanda Quote")}
            elementType="textarea"
            elementConfig={{
              type: "text",
              placeholder: t("Kinyarwanda Quote"),
            }}
            value={rwQuote}
            changed={setRwQuote}
            validation={{ required: true }}
            shouldValidate
            error={t("Kinyarwanda Quote is required")}
          />
        </div>
        <Input
          label={t("Order")}
          elementType="input"
          elementConfig={{
            type: "number",
            placeholder: t("Order"),
          }}
          value={order}
          changed={setOrder}
          validation={{ required: true }}
          shouldValidate
          error={t("Order is required")}
        />
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
          clicked={isUpdating ? () => handleUpdate(quoteId) : handleAdd}
        />
      </Modal>
      <Modal
        show={showArchiveModal}
        small
        modalClosed={(e) => {
          setShowArchiveModal(false);
        }}
      >
        <CardTitle name={t("Archive quote")} color="red" />
        <CardBody
          name={t("Are you sure you want to archive/unarchive this quote?")}
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
        <CardTitle name={t("Delete quote")} color="red" />
        <CardBody
          name={`${t("Are you sure you want to delete this quote?")} ${t(
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
        <SectionTitle name={t("List of all quotes")} />
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
                name={t("Add new quote")}
                isSquare
                outline="false"
                color="blue"
                clicked={() => {
                  setShowEditModal(true);
                  setIsUpdating(false);
                  setEnRole("");
                  setFrRole("");
                  setRwRole("");
                  setEnQuote("");
                  setFrQuote("");
                  setRwQuote("");
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

export default QuotesAuthor;

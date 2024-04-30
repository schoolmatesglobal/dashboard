import React, { useState } from "react";
import { useTable } from "react-table";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Spinner,
  Table,
} from "reactstrap";
import Button from "../buttons/button";
import Prompt from "../modals/prompt";
import Action from "../buttons/action";
import { useAssignments } from "../../hooks/useAssignments";
import ButtonGroup from "../buttons/button-group";

const SubmissionTable = ({
  addAssignmentResult,
  addAssignmentResultLoading,
  columns,
  data,
  onCellClick = () => null,
  isLoading = false,
  centered = false,
  rowHasDelete = false,
  rowHasView = false,
  rowHasStatusToggle = false,
  onRowDelete = () => null,
  onRowStatusToggle = () => null,
  onRowUpdate = () => null,
  hasCheckBox = false,
  checkedRows = [],
  setCheckedRows = () => null,
  rowHasAction = false,
  action = [],
  markedQ,
  result,
  total_mark,
  score,
  mark,
  ResultTab,
}) => {
  const { myStudents, permission, user } = useAssignments();

  const { question_type, subject, student } = markedQ;

  const [modalOpen, setModalOpen] = useState(false);
  const [actionDropdown, setActionDropdown] = useState(false);
  const [actionId, setActionId] = useState("");
  const [previewAns, setPreviewAns] = useState({});
  const [modalStatus, setModalStatus] = useState("disable");
  const [row, setRow] = useState({});

  // const toggleModal = () => setModalOpen(!modalOpen);

  const [loginPrompt, setLoginPrompt] = useState(false);
  const [loginPrompt2, setLoginPrompt2] = useState(false);

  const [value, setValue] = useState("");

  const disableMark = () => {
    if (value === "") {
      return true;
    } else {
      return false;
    }
  };

  const buttonOptions = [
    {
      title: `Cancel`,
      onClick: () => setLoginPrompt(false),
      variant: "outline",
    },
  ];

  const buttonOptions2 = [
    {
      title: `${
        ResultTab === "1"
          ? "Submit CBT Result"
          : ResultTab === "2"
          ? "Submit Theory Result"
          : ""
      }`,
      onClick: () => {
        setLoginPrompt2(true);
      },
      // disabled: objectiveSubmitted,
    },
  ];

  const buttonOptions3 = [
    {
      title: "Cancel",
      onClick: () => setLoginPrompt2(false),
      variant: "outline",
    },
    {
      title: "Yes Submit",
      onClick: () => {
        const assg2 = [
          {
            period: user?.period,
            term: user?.term,
            session: user?.session,
            student_id: data[0]?.student_id,
            subject_id: data[0]?.subject_id,
            question_type: ResultTab === "1" ? "objective" : "theory",
            assignment_id: data[0]?.assignment_id,
            mark: result?.percentage,
            total_mark: result?.total_marks,
            score: result?.percentage,
            week: data[0]?.week,
            
          },
        ];
        const assg3 = {
          result: [
            {
              period: user?.period,
              term: user?.term,
              session: user?.session,
              assignment_id: data[0]?.assignment_id,
              student_id: data[0]?.student_id,
              subject_id: data[0]?.subject_id,
              question_type: ResultTab === "1" ? "objective" : "theory",
              total_mark: result?.total_marks,
              score: result?.percentage,
              week: data[0]?.week,
            },
          ],
          performance: {
            period: user?.period,
            term: user?.term,
            session: user?.session,
            assignment_id: data[0]?.assignment_id,
            student_id: data[0]?.student_id,
            subject_id: data[0]?.subject_id,
            question_type: ResultTab === "1" ? "objective" : "theory",
            total_mark: result?.total_marks,
            percentage_score: result?.percentage,
            week: data[0]?.week,
          }
        }

       

        addAssignmentResult(assg3);

        setTimeout(() => {
          setLoginPrompt2(false);
        }, 1000);
      },
      //   disabled: activatePreview(),
      isLoading: addAssignmentResultLoading,
      //
      // variant: "outline",
    },
  ];

  const toggleAction = (id) => {
    setActionDropdown(!actionDropdown);
    setActionId(actionId ? "" : id);
  };

  const openModal = (row, status) => {
    setRow(row);
    setModalStatus(status);
    setModalOpen(true);
  };

  const onModalContinue = () => {
    setModalOpen(false);
    switch (modalStatus) {
      case "delete":
        return onRowDelete(row?.original?.id);

      default:
        return onRowStatusToggle({
          id: row?.original?.id,
          status: row?.original?.status === "disabled" ? "active" : "disabled",
        });
    }
  };

  const displayStatus = (render) => {
    switch (render) {
      case "disabled":
        return <p className='text-danger'>Inactive</p>;

      case "withdrawn":
        return <p className='text-danger'>Withdrawn</p>;

      default:
        return <p className='text-success'>Active</p>;
    }
  };

  const checkAllBoxes = () => {
    if (checkedRows.length === data.length) {
      setCheckedRows([]);
    } else {
      const dataIds = data.map((x) => x.id);
      setCheckedRows(dataIds);
    }
  };

  const checkSingleRow = (id) => {
    if (checkedRows.includes(id)) {
      const filter = checkedRows.filter((r) => r !== id);
      setCheckedRows(filter);
    } else {
      setCheckedRows([...checkedRows, id]);
    }
  };

  const memoisedData = React.useMemo(() => data || [], [data]);

  const memoisedColumns = React.useMemo(() => columns, [columns]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: memoisedColumns, data: memoisedData });

  const filterData = (data, values) => {
    const filtered = data.find(
      (ft) => Number(ft.question_number) === Number(values.question_number)
    );
    setPreviewAns(filtered);
    setLoginPrompt(true);
    console.log({ filtered, previewAns, values, data });
    // console.log({ filtered });
  };

  const studentName = () => {
    const findObject = myStudents?.find(
      (opt) => opt.id === Number(data[data?.length - 1]?.student_id)
    );
    if (findObject) {
      return findObject.value;
    }
  };

  // console.log({ previewAns, answerHighlight, markedQ, result });

  return (
    <div className='custom-table-wrapper'>
      {isLoading && (
        <div className='d-flex align-items-center justify-content-center w-full'>
          <Spinner /> <p className='ms-2'>Loading...</p>
        </div>
      )}
      {memoisedData.length && !isLoading ? (
        <div>
          <Table
            {...getTableProps()}
            className={`custom-table ${centered ? "centered" : ""}`}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {hasCheckBox && (
                    <th>
                      <Input
                        type='checkbox'
                        checked={checkedRows.length === memoisedData.length}
                        onChange={checkAllBoxes}
                      />
                    </th>
                  )}
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                  {rowHasView && <th>Preview</th>}
                  {rowHasStatusToggle && <th>Disable</th>}
                  {rowHasDelete && <th>Delete</th>}
                  {rowHasAction && <th>Action</th>}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                // console.log(row);
                return (
                  <tr {...row.getRowProps()}>
                    {hasCheckBox && (
                      <td>
                        <Input
                          type='checkbox'
                          checked={checkedRows.includes(row.original.id)}
                          onChange={() => checkSingleRow(row.original.id)}
                        />
                      </td>
                    )}
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          onClick={() => onCellClick(cell)}
                        >
                          {cell.column.id === "status"
                            ? displayStatus(cell.value)
                            : cell.render("Cell")}
                        </td>
                      );
                    })}
                    {rowHasView && (
                      <td>
                        <Button
                          className='d-block mx-auto'
                          onClick={() => {
                            filterData(data, row.values);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    )}
                    {rowHasStatusToggle && (
                      <td>
                        <Button
                          variant={
                            row.original.status === "disabled"
                              ? "dark"
                              : "warning"
                          }
                          className='d-block mx-auto'
                          onClick={() => openModal(row, "disable")}
                        >
                          {row.original.status === "disabled"
                            ? "Enable"
                            : "Disable"}
                        </Button>
                      </td>
                    )}
                    {rowHasDelete && (
                      <td>
                        <Button
                          variant='danger'
                          className='d-block mx-auto'
                          onClick={() => openModal(row, "delete")}
                        >
                          Delete
                        </Button>
                      </td>
                    )}
                    {rowHasAction && (
                      <td>
                        <Dropdown
                          isOpen={
                            actionDropdown && row.original.id === actionId
                          }
                          toggle={() => toggleAction(row.original.id)}
                        >
                          <DropdownToggle tag='div'>
                            <Action
                              onClick={() => toggleAction(row.original.id)}
                            />
                          </DropdownToggle>
                          <DropdownMenu>
                            {action?.map(({ onClick, title }, key) => (
                              <DropdownItem
                                onClick={() => onClick(row.original.id)}
                                className='px-5 py-3'
                                key={key}
                              >
                                {title}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {permission?.results && (
            <div className='d-flex justify-content-center '>
              <ButtonGroup options={buttonOptions2} />
            </div>
          )}
          <Prompt
            isOpen={loginPrompt2}
            toggle={() => setLoginPrompt2(!loginPrompt2)}
            hasGroupedButtons={true}
            groupedButtonProps={buttonOptions3}
            singleButtonText='Preview'
            promptHeader={`CONFIRM RESULT SUBMISSION`}
          >
            <div className=''>
              <p className='fs-3 fw-bold mb-3'>Student's Name:</p>
              <p className='fs-3 mb-5 lh-sm'>{student}</p>
              <p className='fs-3 fw-bold mb-3'>Subject</p>
              <p className='fs-3 mb-5 lh-sm'>
                {subject} ({ResultTab === "1" ? "objective" : "theory"})
              </p>

              <label className='fs-3 fw-bold mb-3'>Student's Score</label>
              <p className='fs-3 mb-5 lh-sm'>{result?.score}</p>

              <p className='fs-3 fw-bold mb-3'>Total Score</p>
              <p className='fs-3 mb-5 lh-sm'> {result?.total_marks}</p>
              <p className='fs-3 fw-bold mb-3'>Percentage</p>
              <p className='fs-3 mb-5 lh-sm'> {`${result?.percentage}%`}</p>
            </div>
          </Prompt>
          <Prompt
            hasGroupedButtons={true}
            groupedButtonProps={buttonOptions}
            isOpen={loginPrompt}
            toggle={() => setLoginPrompt(!loginPrompt)}
            promptHeader={`PREVIEW ANSWER `}
          >
            <div className=''>
              <p className='fs-3 fw-bold mb-3'>Question</p>
              <p className='fs-3 mb-5 lh-sm'>{previewAns?.question}</p>
              <p className='fs-3 fw-bold mb-3'>Correct Answer</p>
              <p className='fs-3 mb-5 lh-sm'>{previewAns?.correct_answer}</p>
              <p className='fs-3 fw-bold mb-3'>Student's Answer</p>
              <p
                className={`${
                  previewAns?.answer === previewAns?.correct_answer &&
                  previewAns?.question_type === "objective"
                    ? "text-success"
                    : previewAns?.answer !== previewAns?.correct_answer &&
                      previewAns?.question_type === "objective"
                    ? "text-danger"
                    : ""
                } fs-3 mb-5 lh-sm`}
              >
                {previewAns?.answer}
              </p>
            </div>

            {/* {data[data?.length - 1]?.question_type === "theory" && (
              <div className="d-flex align-items-center gap-5 mt-4">
                <div style={{ width: "100px" }}>
                  <label
                    className={styles.create_question_label}
                    // style={{ fontSize: "15px", fontWeight: 600 }}
                  >
                    Teacher's Mark
                  </label>
                  <AuthInput
                    type="number"
                    placeholder="Teacher's Mark"
                    // hasError={!!errors.username}
                    value={value}
                    name="option"
                    max={Number(previewAns?.question_mark)}
                    min={0}
                    onChange={handleInputChange}
                    wrapperClassName=""
                  />
                </div>
                <div style={{ width: "100px" }}>
                  <label
                    className={styles.create_question_label}
                    // style={{ fontSize: "15px", fontWeight: 600 }}
                  >
                    Question's Mark
                  </label>
                  <AuthInput
                    type="number"
                    placeholder="Question's Mark"
                    // defaultValue={!!errors.username}
                    disabled
                    value={Number(previewAns?.question_mark)}
                    name="option"
                    onChange={(e) => {
                      // updateCreateQ({
                      //   total_question: e.target.value,
                      //   // total_mark: e.target.value * question_mark,
                      // });
                      // calcObjTotal();
                    }}
                    wrapperClassName=""
                  />
                </div>
              </div>
            )} */}
          </Prompt>
        </div>
      ) : null}
      {!memoisedData.length && !isLoading ? (
        <p className='text-center'>No data to display.</p>
      ) : null}
    </div>
  );
};

export default SubmissionTable;

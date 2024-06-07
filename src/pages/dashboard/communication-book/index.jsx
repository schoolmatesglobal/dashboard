import React, { useEffect, useState } from "react";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";

import PageSheet from "../../../components/common/page-sheet";
import { useCommunicationBook } from "../../../hooks/useCommunicationBook";
import CbtStudentsRow from "../../../components/common/cbt-students-row";
import CBStudentsRow from "../../../components/common/cb-students-row";
import Button from "../../../components/buttons/button";
import { useClasses } from "../../../hooks/useClasses";
import AuthSelect from "../../../components/inputs/auth-select";
import useMyMediaQuery2 from "../../../hooks/useMyMediaQuery2";
import useMyMediaQuery from "../../../hooks/useMyMediaQuery";
import Prompt from "../../../components/modals/prompt";
import CustomFileInput2 from "../../../components/inputs/CustomFileInput2";
import MessageCard from "./MessageCard";
import dayjs from "dayjs";
import { msg, trimText } from "./constant";
import { parse, formatDistanceToNow } from "date-fns";
import { ImAttachment } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import AuthInput from "../../../components/inputs/auth-input";
import { TiPin } from "react-icons/ti";
import { BsCheck2All } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FaRegCalendarCheck, FaRegCalendar } from "react-icons/fa";
import { colors } from "../../../utils/constants";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import {
  Element,
  Events,
  Link as ScrollLink,
  scroller,
  scrollSpy,
} from "react-scroll";

const CommunicationBookPage = () => {
  const {
    permission,
    user,
    studentByClass,
    refetchStudentByClass,
    studentByClassLoading,
    selectedStudent,
    setSelectedStudent,
    classSelected,
    setClassSelected,
    isRefetchingStudentByClass,
    classValue,
    createQuestionPrompt,
    setCreateQuestionPrompt,
    file,
    setFile,
    fileName,
    setFileName,
    error,
    setError,
    handleFileChange,
    handleReset,
    // handleDownload,
    handleViewFile,
    handleViewFile2,
    base64String,
    setBase64String,
    messages,
    setMessages,
  } = useCommunicationBook();

  const { xs, sm, md, lg, xl, xxl } = useMyMediaQuery();

  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);

  const [activeSection, setActiveSection] = useState("");

  const [openMessage, setOpenMessage] = useState(false);
  const [editMessagePrompt, setEditMessagePrompt] = useState(false);
  const [editMessagePrompt2, setEditMessagePrompt2] = useState(false);

  const [deletePrompt, setDeletePrompt] = useState(false);
  const [deletePrompt2, setDeletePrompt2] = useState(false);

  const [replyMessage, setReplyMessage] = useState("");
  const [messageDeleteId, setMessageDeleteId] = useState("");
  const [ticketCloseId, setTicketCloseId] = useState("");
  const [ticketTab, setTicketTab] = useState("1");

  const [openedTitle, setOpenedTitle] = useState("");
  const [openedConversations, setOpenedConversations] = useState([]);

  const [selectedMessage, setSelectedMessage] = useState({
    id: "",
    title: "",
    message: "",
    date: "",
    sender: "",
    sender_email: "",
    recipient: "",
    recipient_email: "",
    file: "",
    file_name: "",
    conversations: [],
  });

  const [selectedMessage2, setSelectedMessage2] = useState({
    id: "",
    title: "",
    message: "",
    date: "",
    sender: "",
    sender_email: "",
    recipient: "",
    recipient_email: "",
    file: "",
    file_name: "",
  });

  const dateString = new Date().toLocaleString();

  const date = dayjs(new Date()).format("dddd, MMMM D, YYYY h:mm A");
  const time = dayjs(new Date()).format("h:mm A");

  const {
    classes,
    // checkedSubjects,
    // setCheckedSubjects,
    // isLoading: classLoading,
  } = useClasses();

  const {
    email_address,
    message,
    recipient,
    sender,
    sender_email,
    title,
    student_id,
    student,
  } = selectedStudent;

  const studentsEmail = studentByClass?.map((sc, i) => {
    return sc.email_address;
  });

  const activateSend = () => {
    if (!message || !title) {
      return true;
    } else {
      return false;
    }
  };

  const firstSelectedMessage = () => {
    if (selectedMessage?.conversations?.length > 0) {
      return messages[0]?.conversations[0];
    }
  };

  const newStudentByClass = () => {
    if (studentByClass) {
      return [
        {
          admission_number: "",
          age: 1,
          blood_group: "A+",
          campus: "Corona Elementary",
          campus_type: "Elementary",
          class: "BASICS 1",
          class_sub_class: "",
          dob: "2023-02-08",
          firstname: "All",
          gender: "all",
          genotype: "AA",
          home_address: "2801 Island Avenue",
          id: "99999",
          image: "",
          middlename: "Class",
          nationality: "Nigeria",
          new_id: 1,
          phone_number: "+23481345685686",
          present_class: "BASICS 1",
          session_admitted: "2024",
          state: "Lagos",
          status: "active",
          sub_class: "",
          surname: "Students",
          username: "COROS001",
          email_address: studentsEmail,
          recipient: "All Students",
        },
        ...studentByClass,
      ];
    }
  };

  const deleteButtons = [
    {
      title: "No",
      // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
      onClick: () => {
        // setWarningPrompt(true);
        setDeletePrompt(false);
      },
      // variant: `${activeTab === "2" ? "" : "outline"}`,
    },
    {
      title: "Yes",
      onClick: () => {
        //   const filt = messages?.filter((ms) => ms?.id !== selectedMessage?.id);

        //   setMessages([...filt]);
        //   setDeletePrompt(false);
        //   // deleteLessonNote();
        //   // setTimeout(() => {
        //   //   setDeletePrompt(false);
        //   // }, 1000);
        // },
        const filt = openTickets?.filter(
          (ms) => ms?.id !== selectedMessage?.id
        );
        // const filtClosed = closedTickets?.filter(
        //   (ms) => ms?.id !== selectedMessage?.id
        // );
        const filt2 = openTickets?.find((ms) => ms?.id === selectedMessage?.id);

        setOpenTickets([...filt]);

        setClosedTickets([
          ...closedTickets,
          {
            ...filt2,
            ticket_status: "closed",
          },
        ]);

        setDeletePrompt(false);
      },
      variant: "outline-danger",
      //   isLoading: deleteLessonNoteLoading,
    },
  ];

  const deleteButtons2 = [
    {
      title: "No",
      // isLoading: addObjectAssignmentLoading || addTheoryAssignmentLoading,
      onClick: () => {
        // setWarningPrompt(true);
        setDeletePrompt2(false);
      },
      // variant: `${activeTab === "2" ? "" : "outline"}`,
    },
    {
      title: "Yes",
      onClick: () => {
        const filt = openTickets?.filter(
          (ms) => ms?.id !== selectedMessage?.id
        );

        const filtOpened = openTickets?.find(
          (ms) => ms?.id === selectedMessage?.id
        );

        const filt2 = selectedMessage?.conversations?.filter(
          (ms) => ms?.id !== messageDeleteId
        );

        setSelectedMessage({
          ...selectedMessage,
          conversations: [...filt2],
        });

        setOpenTickets([
          ...filt,
          {
            ...filtOpened,
            conversations: [...filt2],
          },
        ]);

        setDeletePrompt2(false);

        // deleteLessonNote();
        // setTimeout(() => {
        //   setDeletePrompt(false);
        // }, 1000);
      },
      variant: "outline-danger",
      //   isLoading: deleteLessonNoteLoading,
    },
  ];

  const buttonOptions = [
    {
      title: "Cancel",
      onClick: () => setCreateQuestionPrompt(false),
      variant: "outline",
    },
    {
      title: "Send",
      disabled: activateSend(),
      //   isLoading: addLessonNoteLoading,
      onClick: async () => {
        setOpenTickets((prev) => [
          ...prev,
          {
            id: dateString,
            // sender: `${user?.firstname} ${user?.surname} (${user?.designation_name})`,
            // sender_email: user?.email ?? "",
            title,
            ticket_status: "open",
            // message,
            // recipient_email: email_address,
            // recipient,
            // date,
            conversations: [
              {
                id: dateString,
                sender: `${user?.firstname} ${user?.surname} (${user?.designation_name})`,
                sender_email: user?.email ?? "",
                message,
                file: file,
                file_name: fileName,
                recipient_email: email_address,
                recipient,
                date,
                read_status: "unread",
              },
            ],
          },
        ]);
        setCreateQuestionPrompt(false);
        // await addLessonNote();
        // trigger(500);
      },
      // variant: "outline",
    },
  ];

  const buttonOptions2 =
    selectedMessage?.ticket_status === "open"
      ? [
          {
            title: "Cancel",
            onClick: () => setOpenMessage(false),
            variant: "outline",
          },

          {
            title: "Send",
            //   title: "Send",
            //   disabled: !replyMessage,
            //   isLoading: addLessonNoteLoading,
            onClick: async () => {
              if (!replyMessage) return;

              const filt = openTickets?.filter(
                (sm) => sm?.id !== selectedMessage?.id
              );
              const filt2 = openTickets?.find(
                (sm) => sm?.id === selectedMessage?.id
              );

              // const filtConv = selectedMessage

              setSelectedMessage({
                ...selectedMessage,
                conversations: [
                  ...selectedMessage?.conversations,
                  {
                    id: dateString,
                    sender: selectedMessage?.sender,
                    sender_email: selectedMessage?.sender_email,
                    title: selectedMessage?.title,
                    message: replyMessage,
                    file: file,
                    file_name: fileName,
                    recipient_email: selectedMessage?.recipient_email,
                    recipient: selectedMessage?.recipient,
                    date,
                  },
                ],
              });

              setOpenTickets([
                ...filt,
                {
                  ...filt2,
                  conversations: [
                    ...selectedMessage?.conversations,
                    {
                      sender: selectedMessage?.sender,
                      sender_email: selectedMessage?.sender_email,
                      title: selectedMessage?.title,
                      message: replyMessage,
                      file: file,
                      file_name: fileName,
                      recipient_email: selectedMessage?.recipient_email,
                      recipient: selectedMessage?.recipient,
                      date,
                    },
                  ],
                },
              ]);

              setReplyMessage("");
              setFile(null);
              setFileName("");
              // setCreateQuestionPrompt(false);
              // await addLessonNote();
              // trigger(500);
            },
            // variant: "outline",
          },
        ]
      : [
          {
            title: "Cancel",
            onClick: () => setOpenMessage(false),
            variant: "outline",
          },
        ];

  // edit of messages
  const editButtonOptions = [
    {
      title: "Cancel",
      onClick: () => setEditMessagePrompt(false),
      variant: "outline",
    },
    {
      title: "Send",
      //   title: "Send",
      //   disabled: !replyMessage,
      //   isLoading: addLessonNoteLoading,
      onClick: async () => {
        if (!selectedMessage2?.message) return;

        const filt = openTickets?.filter(
          (sm) => sm?.id !== selectedMessage2?.id
        );

        const filtOpened = openTickets?.find(
          (sm) => sm?.id === selectedMessage2?.id
        );

        const filt2 = selectedMessage?.conversations?.filter(
          (ms) => ms?.id !== messageDeleteId
        );

        // const filtConv = selectedMessage

        setSelectedMessage({
          ...selectedMessage,
          conversations: [
            ...filt2,
            {
              id: messageDeleteId,
              sender: selectedMessage2?.sender,
              sender_email: selectedMessage2?.sender_email,
              //   title: selectedMessage2?.title,
              message: selectedMessage2?.message,
              file: file,
              file_name: fileName,
              recipient_email: selectedMessage2?.recipient_email,
              recipient: selectedMessage2?.recipient,
              date,
            },
          ],
        });

        setOpenTickets([
          ...filt,
          {
            ...filtOpened,
            conversations: [
              ...filt2,
              {
                id: messageDeleteId,
                sender: selectedMessage2?.sender,
                sender_email: selectedMessage2?.sender_email,
                //   title: selectedMessage2?.title,
                message: selectedMessage2?.message,
                file: file,
                file_name: fileName,
                recipient_email: selectedMessage2?.recipient_email,
                recipient: selectedMessage2?.recipient,
                date,
              },
            ],
          },
        ]);

        setReplyMessage("");
        setFile(null);
        setFileName("");

        setEditMessagePrompt(false);
        // setCreateQuestionPrompt(false);
        // await addLessonNote();
        // trigger(500);
      },
      // variant: "outline",
    },
  ];

  // edit of ticket details
  const editButtonOptions2 = [
    {
      title: "Cancel",
      onClick: () => setEditMessagePrompt2(false),
      variant: "outline",
    },
    {
      title: "Send",
      //   title: "Send",
      //   disabled: !replyMessage,
      //   isLoading: addLessonNoteLoading,
      onClick: async () => {
        if (!selectedMessage2?.message) return;

        const filt = openTickets?.filter(
          (sm) => sm?.id !== selectedMessage?.id
        );

        const filtOpened = openTickets?.find(
          (sm) => sm?.id === selectedMessage?.id
        );

        const filt2 = selectedMessage?.conversations?.filter(
          (ms) => ms?.id !== messageDeleteId
        );

        const checkFirstMessage = () => {
          if (messageDeleteId === msg[0]?.conversations[0]?.id) {
            return true;
          } else {
            return false;
          }
        };

        // const filtConv = selectedMessage

        setSelectedMessage({
          ...selectedMessage,
          title: selectedMessage2?.title,
          conversations: [
            ...filt2,
            {
              id: messageDeleteId,
              sender: selectedMessage2?.sender,
              sender_email: selectedMessage2?.sender_email,
              //   title: selectedMessage2?.title,
              message: selectedMessage2?.message,
              file: file,
              file_name: fileName,
              recipient_email: selectedMessage2?.recipient_email,
              recipient: selectedMessage2?.recipient,
              date: checkFirstMessage() ? selectedMessage2?.date : date,
            },
          ],
        });

        setOpenTickets([
          ...filt,
          {
            ...filtOpened,
            title: selectedMessage2?.title,
            conversations: [
              ...filt2,
              {
                id: messageDeleteId,
                sender: selectedMessage2?.sender,
                sender_email: selectedMessage2?.sender_email,
                //   title: selectedMessage2?.title,
                message: selectedMessage2?.message,
                file: file,
                file_name: fileName,
                recipient_email: selectedMessage2?.recipient_email,
                recipient: selectedMessage2?.recipient,
                date: checkFirstMessage() ? selectedMessage2?.date : date,
              },
            ],
          },
        ]);

        setReplyMessage("");
        setFile(null);
        setFileName("");

        setEditMessagePrompt2(false);
        // setCreateQuestionPrompt(false);
        // await addLessonNote();
        // trigger(500);
      },
      // variant: "outline",
    },
  ];

  const classWidth = () => {
    if (xs || sm) {
      return "100";
    } else {
      return "25";
    }
  };

  const showStudentRow = () => {
    if (user?.department === "Admin" && classSelected) {
      return true;
    } else if (
      user?.department !== "Admin" &&
      newStudentByClass()?.length > 0
    ) {
      return true;
    }
  };

  const allLoading = studentByClassLoading || isRefetchingStudentByClass;
  const showStudentRowWarning = () => {
    if (user?.department === "Admin" && !classSelected) {
      return true;
    } else if (
      user?.department !== "Admin" &&
      newStudentByClass()?.length == 0
    ) {
      return true;
    }
  };

  useEffect(() => {
    if (classSelected) {
      refetchStudentByClass();
    }
  }, [classSelected]);

  useEffect(() => {
    const opened = msg?.filter((ms) => ms?.ticket_status === "open");
    const closed = msg?.filter((ms) => ms?.ticket_status === "closed");

    setOpenTickets([...opened]);
    setClosedTickets([...closed]);

    // setMessages([...msg]);
  }, []);

  useEffect(() => {
    const handleScrollEvent = (to, element) => {
      console.log("end", to, element);
      setActiveSection(to);
    };

    // Registering the 'begin' event and logging it to the console when triggered.

    Events.scrollEvent.register("end", handleScrollEvent);

    return () => {
      Events.scrollEvent.remove("end", handleScrollEvent);
    };
  }, []);

  //   const allLoading = studentByClassLoading || isRefetchingStudentByClass;

  console.log({
    // classWidth: classWidth(),
    // permission,
    // user,
    // newStudentByClass: newStudentByClass(),
    // selectedStudent,
    // studentsEmail,
    msg,
    messages,
    openTickets,
    closedTickets,
    selectedMessage,
    selectedMessage2,
    // messageDeleteId,
    ticketTab,
  });

  return (
    <div className='results-sheet'>
      <PageSheet>
        <div className={styles.home}>
          <div className='d-flex align-items-center gap-3 mb-3'>
            <Button
              className='w-auto'
              onClick={() => {
                setTicketTab("1");
                // handleViewFile(notes?.file);
              }}
              variant={`${ticketTab === "1" ? "" : "outline"}`}
            >
              <FontAwesomeIcon icon={faCalendarAlt} /> Active Tickets
            </Button>
            <Button
              className='w-auto'
              onClick={() => {
                setTicketTab("2");
                // handleViewFile(notes?.file);
              }}
              variant={`${ticketTab === "2" ? "" : "outline"}`}
            >
              <FontAwesomeIcon icon={faCalendarCheck} /> Closed Tickets
            </Button>
          </div>
          {user?.department === "Admin" && (
            <div className='d-flex col-6 col-md-3 col-lg-3'>
              <AuthSelect
                sort
                value={classSelected}
                onChange={({ target: { value } }) => {
                  setClassSelected(value);
                }}
                options={(classes || []).map((x) => ({
                  value: x?.class_name,
                  title: x?.class_name,
                }))}
                placeholder='Select Class'
                wrapperClassName={`d-flex`}
                //   wrapperClassName='w-100'
              />
            </div>
          )}

          <div className='w-100 mt-4 border border-2 pt-4 pb-2  px-3 rounded-3 d-flex align-items-center'>
            {showStudentRow() && (
              <CBStudentsRow
                studentByClassAndSession={newStudentByClass()}
                onProfileSelect={(x) => {
                  setSelectedStudent((prev) => {
                    return {
                      ...prev,
                      //   ...x,
                      sender: `${user?.firstname} ${user?.surname}`,
                      sender_email: user?.email ?? "",
                      student: `${x.surname} ${x.firstname}`,
                      recipient:
                        x.id === "99999"
                          ? `${x.firstname} ${x.surname} in ${user?.class_assigned}`
                          : `${x.surname} ${x.firstname}`,
                      student_id: x.id,
                      email_address:
                        x.id === "99999"
                          ? [...x.email_address]
                          : [x.email_address],
                    };
                  });
                }}
                isLoading={allLoading}
                selectedStudent={selectedStudent}
                // idWithComputedResult={idWithComputedResult}
              />
            )}
            {showStudentRowWarning() && (
              <div className='w-100 d-flex justify-content-center align-items-center mb-3 gap-3 bg-danger bg-opacity-10 py-3 px-4'>
                <p className='fs-4 text-danger'>
                  {user?.department === "Admin"
                    ? "Please select a class"
                    : "No Student in Class"}
                </p>
              </div>
            )}
          </div>

          {ticketTab === "1" && (
            <div className='d-flex w-100 mt-3 justify-content-end'>
              <Button
                variant=''
                className='w-auto'
                onClick={() => {
                  // setCreateN((prev) => {
                  //   return { ...prev, topic: "", description: "" };
                  // });
                  // setFile(null);
                  // setFileName("");
                  setFile(null);
                  setError("");
                  setFileName("");
                  setBase64String("");
                  setSelectedStudent((prev) => ({
                    ...prev,
                    title: "",
                    message: "",
                  }));
                  setCreateQuestionPrompt(true);
                }}
                disabled={!student_id}
              >
                Create
              </Button>
            </div>
          )}

          {ticketTab === "1" && openTickets?.length === 0 && (
            <div
              className='d-flex flex-column w-100 align-items-center justify-content-center h-100'
              style={{ minHeight: "50vh" }}
            >
              <HiOutlineDocumentPlus style={{ fontSize: "50px" }} />
              <p className='fs-1 fw-bold mt-3'>Create Ticket</p>
            </div>
          )}

          {ticketTab === "2" && closedTickets?.length === 0 && (
            <div
              className='d-flex flex-column w-100 align-items-center justify-content-center h-100'
              style={{ minHeight: "50vh" }}
            >
              <HiOutlineDocumentPlus style={{ fontSize: "50px" }} />
              <p className='fs-1 fw-bold mt-3'>No Ticket</p>
            </div>
          )}

          {ticketTab === "1" &&
            openTickets
              ?.filter((ms) => ms?.ticket_status === "open")
              ?.sort((a, b) => {
                if (
                  new Date(a.conversations[0]?.date) <
                  new Date(b.conversations[0].date)
                ) {
                  return 1;
                }
                if (
                  new Date(a.conversations[0]?.date) >
                  new Date(b.conversations[0].date)
                ) {
                  return -1;
                }
                return 0;
              })
              ?.map((mm, i) => {
                return (
                  <div className='mb-5 mt-5' key={i}>
                    <MessageCard
                      message={mm}
                      messages={messages}
                      openTickets={openTickets}
                      selectedMessage={selectedMessage}
                      setMessages={setMessages}
                      setOpenTickets={setOpenTickets}
                      setOpenMessage={setOpenMessage}
                      setSelectedMessage={setSelectedMessage}
                      setFile={setFile}
                      setFileName={setFileName}
                      setReplyMessage={setReplyMessage}
                      user={user}
                      setDeletePrompt={setDeletePrompt}
                      setTicketCloseId={setTicketCloseId}
                      ticketTab={ticketTab}
                    />
                  </div>
                );
              })}

          {ticketTab === "2" &&
            closedTickets
              ?.filter((ms) => ms?.ticket_status === "closed")
              ?.sort((a, b) => {
                if (
                  new Date(a.conversations[0]?.date) <
                  new Date(b.conversations[0].date)
                ) {
                  return 1;
                }
                if (
                  new Date(a.conversations[0]?.date) >
                  new Date(b.conversations[0].date)
                ) {
                  return -1;
                }
                return 0;
              })
              ?.map((mm, i) => {
                return (
                  <div className='mb-5 mt-5' key={i}>
                    <MessageCard
                      message={mm}
                      messages={messages}
                      openTickets={openTickets}
                      selectedMessage={selectedMessage}
                      setMessages={setMessages}
                      setOpenTickets={setOpenTickets}
                      setOpenMessage={setOpenMessage}
                      setSelectedMessage={setSelectedMessage}
                      setFile={setFile}
                      setFileName={setFileName}
                      setReplyMessage={setReplyMessage}
                      user={user}
                      setDeletePrompt={setDeletePrompt}
                      setTicketCloseId={setTicketCloseId}
                      ticketTab={ticketTab}
                    />
                  </div>
                );
              })}
        </div>

        {/* Create communication */}
        <Prompt
          isOpen={createQuestionPrompt}
          toggle={() => setCreateQuestionPrompt(!createQuestionPrompt)}
          hasGroupedButtons={true}
          groupedButtonProps={buttonOptions}
          // singleButtonText='Preview'
          promptHeader={`Create Communication Ticket`}
        >
          <>
            <p className='fs-3 fw-bold mb-4'>Recipient</p>
            <div className='border border-1 mb-4 rounded-1 d-flex align-items-center py-3 px-3'>
              <p className='fs-4'>{recipient}</p>
            </div>
            <p className='fs-3 fw-bold mb-4'>Subject</p>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control fs-3 lh-base'
                type='text'
                value={title}
                placeholder='Type the Subject of the message'
                onChange={(e) =>
                  setSelectedStudent((prev) => {
                    return { ...prev, title: e.target.value };
                  })
                }
                style={{
                  minHeight: "70px",
                }}
              />
            </div>
            <p className='fs-3 fw-bold my-4'>Message</p>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control fs-3 lh-base'
                type='text'
                value={message}
                placeholder='Type the body of the message'
                onChange={(e) =>
                  setSelectedStudent((prev) => {
                    return { ...prev, message: e.target.value };
                  })
                }
                style={{
                  minHeight: "120px",
                }}
              />
            </div>

            <p className='fs-3 fw-bold my-4'>Attachment</p>
            <CustomFileInput2
              handleFileChange={handleFileChange}
              fileName={fileName}
              handleReset={handleReset}
              error={error}
              type='all'
              accept='.jpeg, .jpeg,
              .png,
              .gif,
              .bmp,
              .webp, doc, .docx, .pdf'

              // loading={addLessonNoteLoading}
            />

            {/* <div className='w-100 bg-danger bg-opacity-10 text-danger'></div> */}

            {/* <p className="fs-3 text-center my-4">...Uploading</p> */}
          </>
        </Prompt>

        {/* Edit communication thread */}
        <Prompt
          isOpen={editMessagePrompt2}
          toggle={() => setEditMessagePrompt2(!editMessagePrompt2)}
          hasGroupedButtons={true}
          groupedButtonProps={editButtonOptions2}
          // singleButtonText='Preview'
          promptHeader={`Edit Ticket Details`}
        >
          <>
            <p className='fs-3 fw-bold mb-4'>Subject</p>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control fs-3 lh-base'
                type='text'
                value={selectedMessage2?.title}
                placeholder='Type the Subject of the message'
                onChange={(e) =>
                  setSelectedMessage2((prev) => {
                    return { ...prev, title: e.target.value };
                  })
                }
                style={{
                  minHeight: "70px",
                }}
              />
            </div>
            <p className='fs-3 fw-bold my-4'>Message</p>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control fs-3 lh-base'
                type='text'
                value={selectedMessage2?.message}
                placeholder='Type the body of the message'
                onChange={(e) =>
                  setSelectedMessage2((prev) => {
                    return { ...prev, message: e.target.value };
                  })
                }
                style={{
                  minHeight: "120px",
                }}
              />
            </div>

            <p className='fs-3 fw-bold my-4'>Attachment</p>
            <CustomFileInput2
              handleFileChange={handleFileChange}
              fileName={fileName}
              handleReset={handleReset}
              error={error}
              type='all'
              accept='.jpeg, .jpeg,
              .png,
              .gif,
              .bmp,
              .webp, doc, .docx, .pdf'

              // loading={addLessonNoteLoading}
            />

            {/* <div className='w-100 bg-danger bg-opacity-10 text-danger'></div> */}

            {/* <p className="fs-3 text-center my-4">...Uploading</p> */}
          </>
        </Prompt>
        {/* Edit communication message */}
        <Prompt
          isOpen={editMessagePrompt}
          toggle={() => setEditMessagePrompt(!editMessagePrompt)}
          hasGroupedButtons={true}
          groupedButtonProps={editButtonOptions}
          // singleButtonText='Preview'
          promptHeader={`Edit Message`}
        >
          <>
            <p className='fs-3 fw-bold my-4'>Message</p>
            <div className='auth-textarea-wrapper'>
              <textarea
                className='form-control fs-3 lh-base'
                type='text'
                value={selectedMessage2?.message}
                placeholder='Type the body of the message'
                onChange={(e) =>
                  setSelectedMessage2((prev) => {
                    return { ...prev, message: e.target.value };
                  })
                }
                style={{
                  minHeight: "120px",
                }}
              />
            </div>

            <p className='fs-3 fw-bold my-4'>Attachment</p>
            <CustomFileInput2
              handleFileChange={handleFileChange}
              fileName={fileName}
              handleReset={handleReset}
              error={error}
              type='all'
              accept='.jpeg, .jpeg,
              .png,
              .gif,
              .bmp,
              .webp, doc, .docx, .pdf'

              // loading={addLessonNoteLoading}
            />

            {/* <div className='w-100 bg-danger bg-opacity-10 text-danger'></div> */}

            {/* <p className="fs-3 text-center my-4">...Uploading</p> */}
          </>
        </Prompt>

        {/* Open message */}
        <Prompt
          isOpen={openMessage}
          toggle={() => setOpenMessage(!openMessage)}
          hasGroupedButtons={true}
          groupedButtonProps={buttonOptions2}
          showFooter={selectedMessage?.sender_email === user?.email}
          // singleButtonText='Preview'
          promptHeader={trimText(
            selectedMessage?.title,
            xs ? 30 : sm ? 30 : md ? 30 : lg ? 40 : 50
          )}
        >
          <>
            {/* <Element name='service1'>
              <p className=''>Scroll End</p>
            </Element> */}
            <div className='' style={{ minHeight: "200px" }}>
              {selectedMessage?.conversations
                ?.sort((a, b) => {
                  if (new Date(a?.date) < new Date(b?.date)) {
                    return -1;
                  }
                  if (new Date(a?.date) > new Date(b?.date)) {
                    return 1;
                  }
                  return 0;
                })
                ?.map((oc, i) => {
                  const dateObject = new Date(oc.date);
                  const timeAgo2 = formatDistanceToNow(dateObject, {
                    addSuffix: true,
                  });
                  const checkSender = () => {
                    if (oc?.sender?.includes("(")) {
                      return "staff";
                    } else {
                      return "student";
                    }
                  };
                  const checkRecipient = () => {
                    if (oc?.recipient?.includes("(")) {
                      return "staff";
                    } else {
                      return "student";
                    }
                  };
                  const checkSenderType = () => {
                    if (oc?.sender?.includes("(")) {
                      return "staff";
                    } else {
                      return "student";
                    }
                  };
                  return (
                    <div className='' key={i}>
                      <div
                        className={`d-flex w-100 ${
                          checkSender() === "staff"
                            ? "justify-content-start"
                            : "justify-content-end"
                        }`}
                      >
                        <div className='mb-3 d-flex gap-3 align-items-center'>
                          <p className='fs-4'>
                            {dayjs(new Date(oc?.date)).format(
                              "dddd, MMMM D, YYYY "
                            )}
                          </p>
                          {i === 0 && (
                            <TiPin
                              style={{
                                fontSize: "30px",
                              }}
                            />
                          )}
                          {/* <p className='fs-4'>|</p>
                          <p className='fs-4'>
                            {dayjs(new Date(oc?.date)).format("h:mm A")}
                          </p> */}
                        </div>
                      </div>
                      <Element name={oc?.date}>
                        <div
                          className=''
                          style={{
                            //   height: "fit",
                            maxHeight: "200px",
                            minWidth: "200px",
                            border: "1px solid rgba(47, 46, 65, 0.2)",
                            borderRadius: "10px",
                            padding: "15px 15px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            margin: "0px 0px 20px 0px",
                            background:
                              checkSender() === "staff" ? "#e0e0e0" : "#cfedff",
                            overflow: "auto",
                          }}
                        >
                          <div className='d-flex align-items-center justify-content-between  mb-4'>
                            <div className='d-flex align-items-center gap-3'>
                              <p
                                className='fs-4 fw-bold '
                                style={{ cursor: "pointer" }}
                                // onClick={() => open()}
                              >
                                {trimText(oc?.sender, 20)}
                              </p>
                              {oc?.file_name && (
                                <ImAttachment
                                  style={{
                                    color: "#01153b",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            </div>
                            <p className='fs-4 fw-bold'>
                              {dayjs(new Date(oc?.date)).format("h:mm A")}
                            </p>
                          </div>
                          <p className='fs-3 lh-base'>{oc?.message}</p>
                          <div className='d-flex flex-column  flex-md-row justify-content-md-between align-items-md-center mt-4'>
                            {
                              <p
                                className={`fs-4 fw-bold d-none d-md-inline ${
                                  oc?.file_name ? "opacity-100" : "opacity-0"
                                }`}
                                style={{
                                  cursor: oc?.file_name ? "pointer" : "default",
                                }}
                                onClick={() => {
                                  if (typeof oc?.file === "string") {
                                    handleViewFile2(file);
                                  } else {
                                    const url = URL.createObjectURL(oc.file);
                                    handleViewFile2(url);
                                    URL.revokeObjectURL(url);
                                  }
                                }}
                              >
                                View Attachment
                              </p>
                            }
                            {selectedMessage?.ticket_status === "open" && (
                              <div className='d-flex justify-content-end  align-items-center gap-4'>
                                {oc?.sender_email === user?.email && (
                                  <FaEdit
                                    style={{
                                      color: "#01153b",
                                      fontSize: "25px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setMessageDeleteId(oc?.id);
                                      setSelectedMessage2({
                                        ...selectedMessage2,
                                        id: oc?.id,
                                        title: selectedMessage?.title,
                                        message: oc?.message,
                                        date: oc?.date,
                                        sender: oc?.sender,
                                        sender_email: oc?.sender_email,
                                        recipient: oc?.recipient,
                                        recipient_email: oc?.recipient_email,
                                        file: oc?.file,
                                        file_name: oc?.file_name,
                                        ticket_status: oc?.ticket_status,
                                      });
                                      setFile(oc?.file);
                                      setFileName(oc?.file_name);
                                      if (i != 0) {
                                        setEditMessagePrompt(true);
                                      } else if (i === 0) {
                                        setEditMessagePrompt2(true);
                                      }
                                    }}
                                  />
                                )}
                                {i != 0 && (
                                  <MdDelete
                                    style={{
                                      color: "red",
                                      fontSize: "25px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setMessageDeleteId(oc?.id);
                                      setDeletePrompt2(true);
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Element>
                    </div>
                  );
                })}
            </div>

            {selectedMessage?.ticket_status === "open" &&
              selectedMessage?.sender_email === user?.email && (
                <div
                  className='mt-5'
                  style={{
                    borderTop: "1px solid rgba(47, 46, 65, 0.2)",
                    paddingTop: "20px",
                  }}
                >
                  <AuthInput
                    className='form-control fs-3 lh-base'
                    type='text'
                    value={replyMessage}
                    placeholder='Type your response'
                    onChange={(e) => setReplyMessage(e.target.value)}
                    style={
                      {
                        //   minHeight: "70px",
                      }
                    }
                  />

                  <div className='mt-3'>
                    <CustomFileInput2
                      handleFileChange={handleFileChange}
                      fileName={fileName}
                      handleReset={handleReset}
                      error={error}
                      type='all'
                      accept='.jpeg, .jpeg,
                  .png,
                  .gif,
                  .bmp,
                  .webp, doc, .docx, .pdf'
                      // loading={addLessonNoteLoading}
                    />
                  </div>
                </div>
              )}

            {/* <ScrollLink
              to='service1'
              smooth={true}
              offset={-100}
              duration={500}
              className=''
              style={{ cursor: "pointer" }}
            >
              <p className=''>Click</p>
            </ScrollLink> */}
          </>
        </Prompt>

        {/* Close Ticket prompt */}
        <Prompt
          promptHeader={`Confirm Ticket Closure`}
          toggle={() => setDeletePrompt(!deletePrompt)}
          isOpen={deletePrompt}
          hasGroupedButtons={true}
          groupedButtonProps={deleteButtons}
        >
          <p
            className={styles.create_question_question}
            style={{ textAlign: "center" }}
          >
            Are you sure you want to close this ticket? Once closed you can't
            communicate on it.
          </p>
          {/* <p className={styles.create_question_question}>
            Are you sure you want to delete this Communication thread?
          </p> */}
        </Prompt>

        {/* Delete Message prompt */}
        <Prompt
          promptHeader={`Confirm Delete Action`}
          toggle={() => setDeletePrompt2(!deletePrompt2)}
          isOpen={deletePrompt2}
          hasGroupedButtons={true}
          groupedButtonProps={deleteButtons2}
        >
          <p
            className={styles.create_question_question}
            style={{ textAlign: "center" }}
          >
            Are you sure you want to delete this message?
          </p>
          {/* <p className={styles.create_question_question}>
            Are you sure you want to delete this Communication thread?
          </p> */}
        </Prompt>
      </PageSheet>
    </div>
  );
};

export default CommunicationBookPage;

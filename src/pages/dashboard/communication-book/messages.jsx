import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useLocation, useNavigate } from "react-router-dom";
import GoBack from "../../../components/common/go-back";
import PageTitle from "../../../components/common/title";

import dayjs from "dayjs";
import { FaArrowDown, FaArrowUp, FaEdit } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import { MdDelete } from "react-icons/md";
import { TiPin } from "react-icons/ti";
import { useMutation, useQuery } from "react-query";
import { Element, Events, Link, scrollSpy } from "react-scroll";
import { toast } from "react-toastify";
import AuthInput from "../../../components/inputs/auth-input";
import { useCommunicationBook } from "../../../hooks/useCommunicationBook";
import useMyMediaQuery from "../../../hooks/useMyMediaQuery";
import useMyMediaQuery2 from "../../../hooks/useMyMediaQuery2";
import queryKeys from "../../../utils/queryKeys";
import { chatColors, designation, trimText } from "./constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarAlt,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/buttons/button";
import { Spinner } from "reactstrap";
import Prompt from "../../../components/modals/prompt";
import CustomFileInput2 from "../../../components/inputs/CustomFileInput2";

const CommunicationMessages = () => {
  const {
    permission,
    apiServices,
    user: newUser,
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

  const user = {
    ...newUser,
    email: newUser?.email || newUser?.email_address,
  };

  const [replyMessage, setReplyMessage] = useState("");
  const [replyMessages, setReplyMessages] = useState([]);

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

  const [messageDeleteId, setMessageDeleteId] = useState("");

  const [editMessagePrompt, setEditMessagePrompt] = useState(false);
  const [editMessagePrompt2, setEditMessagePrompt2] = useState(false);

  const [deletePrompt, setDeletePrompt] = useState(false);
  const [deletePrompt2, setDeletePrompt2] = useState(false);

  const [activeSection, setActiveSection] = useState("");

  const [showScrollIcon, setShowScrollIcon] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  const messagesEndRef = useRef(null);
  const messagesStartRef = useRef(null);

  const { xs, sm, md, lg, xl, xxl } = useMyMediaQuery();
  const {
    xs: xss,
    sm: smm,
    md: mdd,
    lg: lgg,
    xl: xll,
    xxl: xxll,
  } = useMyMediaQuery2();

  const { id } = useParams();

  const userDesignation = designation(user?.designation_id);

  const date = dayjs(new Date()).format("dddd, MMMM D, YYYY h:mm A");
  const time = dayjs(new Date()).format("h:mm A");

  // FETCH COMMUNICATION BOOK REPLIES /////////
  const {
    isLoading: getCommunicationBookRepliesLoading,
    data: getCommunicationBookReplies,
    isFetching: getCommunicationBookRepliesFetching,
    isRefetching: getCommunicationBookRepliesRefetching,
    refetch: refetchGetCommunicationBookReplies,
  } = useQuery(
    [queryKeys.GET_COMMUNICATION_BOOK_REPLIES],
    () => apiServices.getCommunicationBookReplies(id),
    {
      retry: 2,
      enabled: !!id && permission?.view,

      select: (data) => {
        console.log({ datarr: data, dtr: data?.data });

        if (data?.data?.length > 0) {
          const ddt = data?.data?.map((dt, i) => {
            const type = designation(dt?.sender?.designation);
            return {
              communication_id: dt?.communication_book_id,
              reply_id: dt?.id,
              sender_id: dt?.sender_id,
              sender_type: type,
              sender_email: dt?.sender?.email,
              sender: `${dt?.sender?.first_name} ${dt?.sender?.last_name} (${type})`,
              message: dt?.message,
              date: dayjs(dt?.date, "D MMM YYYY h:mm A").format(
                "dddd MMMM D, YYYY h:mm A"
              ),
            };
          });

          console.log({ ddt });

          return ddt;
        } else {
          return [];
        }

        // return permission?.create ? filt : lsg;
      },

      onSuccess(data) {
        setReplyMessages(data);
        // const dt = [data?.data?.attributes];
        // const dtId = data?.data?.id;
        // const opened = dt?.filter((ms) => ms?.status === "active");
        // const closed = dt?.filter((ms) => ms?.status !== "active");
        // setOpenTickets([...opened]);
        // setClosedTickets([...closed]);
        // setLessonNotes(data);
        // trigger(1000);
      },

      onError(err) {
        apiServices.errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  /////// POST REPLY ////
  const {
    mutateAsync: addCommunicationBookReplies,
    isLoading: addCommunicationBookRepliesLoading,
  } = useMutation(
    // () =>
    apiServices.addCommunicationBookReplies,
    // ({
    //     period: user?.period,
    //     term: user?.term,
    //     session: user?.session,
    //     class_id: user?.class_id,
    //     sender_id: user?.id,
    //     sender_type: user?.designation_name === "Student" ? "student" : "staff",
    //     subject: title,
    //     message,
    //     file: base64String,
    //     file_name: fileName,
    //     recipients: selectedStudent?.email_address,
    //   })
    // () => apiServices.addObjectiveAssignment(finalObjectiveArray),
    {
      onSuccess() {
        refetchGetCommunicationBookReplies();
        // setTimeout(() => {
        //   setCreateQuestionPrompt(false);
        // }, 1000);
        toast.success("Reply was sent successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

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

        // const filt = openTickets?.filter(
        //   (sm) => sm?.id !== selectedMessage?.id
        // );

        // const filtOpened = openTickets?.find(
        //   (sm) => sm?.id === selectedMessage?.id
        // );

        // const filt2 = selectedMessage?.conversations?.filter(
        //   (ms) => ms?.id !== messageDeleteId
        // );

        // const checkFirstMessage = () => {
        //   if (messageDeleteId === msg[0]?.conversations[0]?.id) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // };

        // const filtConv = selectedMessage

        // setSelectedMessage({
        //   ...selectedMessage,
        //   title: selectedMessage2?.title,
        //   conversations: [
        //     ...filt2,
        //     {
        //       id: messageDeleteId,
        //       sender: selectedMessage2?.sender,
        //       sender_email: selectedMessage2?.sender_email,
        //       //   title: selectedMessage2?.title,
        //       message: selectedMessage2?.message,
        //       file: file,
        //       file_name: fileName,
        //       recipient_email: selectedMessage2?.recipient_email,
        //       recipient: selectedMessage2?.recipient,
        //       date: checkFirstMessage() ? selectedMessage2?.date : date,
        //     },
        //   ],
        // });

        // setOpenTickets([
        //   ...filt,
        //   {
        //     ...filtOpened,
        //     title: selectedMessage2?.title,
        //     conversations: [
        //       ...filt2,
        //       {
        //         id: messageDeleteId,
        //         sender: selectedMessage2?.sender,
        //         sender_email: selectedMessage2?.sender_email,
        //         //   title: selectedMessage2?.title,
        //         message: selectedMessage2?.message,
        //         file: file,
        //         file_name: fileName,
        //         recipient_email: selectedMessage2?.recipient_email,
        //         recipient: selectedMessage2?.recipient,
        //         date: checkFirstMessage() ? selectedMessage2?.date : date,
        //       },
        //     ],
        //   },
        // ]);

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

  // edit of messages
  const editButtonOptions = [
    {
      title: "Cancel",
      onClick: () => setEditMessagePrompt(false),
      variant: "outline",
    },
    {
      title: "Update",
      //   title: "Send",
      //   disabled: !replyMessage,
      //   isLoading: addLessonNoteLoading,
      onClick: async () => {
        if (!selectedMessage2?.message) return;

        // const filt = openTickets?.filter(
        //   (sm) => sm?.id !== selectedMessage2?.id
        // );

        // const filtOpened = openTickets?.find(
        //   (sm) => sm?.id === selectedMessage2?.id
        // );

        // const filt2 = selectedMessage?.conversations?.filter(
        //   (ms) => ms?.id !== messageDeleteId
        // );

        // const filtConv = selectedMessage

        // setSelectedMessage({
        //   ...selectedMessage,
        //   conversations: [
        //     ...filt2,
        //     {
        //       id: messageDeleteId,
        //       sender: selectedMessage2?.sender,
        //       sender_email: selectedMessage2?.sender_email,
        //       //   title: selectedMessage2?.title,
        //       message: selectedMessage2?.message,
        //       file: file,
        //       file_name: fileName,
        //       recipient_email: selectedMessage2?.recipient_email,
        //       recipient: selectedMessage2?.recipient,
        //       date,
        //     },
        //   ],
        // });

        // setOpenTickets([
        //   ...filt,
        //   {
        //     ...filtOpened,
        //     conversations: [
        //       ...filt2,
        //       {
        //         id: messageDeleteId,
        //         sender: selectedMessage2?.sender,
        //         sender_email: selectedMessage2?.sender_email,
        //         //   title: selectedMessage2?.title,
        //         message: selectedMessage2?.message,
        //         file: file,
        //         file_name: fileName,
        //         recipient_email: selectedMessage2?.recipient_email,
        //         recipient: selectedMessage2?.recipient,
        //         date,
        //       },
        //     ],
        //   },
        // ]);

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
        // const filt = openTickets?.filter(
        //   (ms) => ms?.id !== selectedMessage?.id
        // );
        // // const filtClosed = closedTickets?.filter(
        // //   (ms) => ms?.id !== selectedMessage?.id
        // // );
        // const filt2 = openTickets?.find((ms) => ms?.id === selectedMessage?.id);

        // setOpenTickets([...filt]);

        // setClosedTickets([
        //   ...closedTickets,
        //   {
        //     ...filt2,
        //     ticket_status: "closed",
        //   },
        // ]);

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
        // const filt = openTickets?.filter(
        //   (ms) => ms?.id !== selectedMessage?.id
        // );

        // const filtOpened = openTickets?.find(
        //   (ms) => ms?.id === selectedMessage?.id
        // );

        // const filt2 = selectedMessage?.conversations?.filter(
        //   (ms) => ms?.id !== messageDeleteId
        // );

        // setSelectedMessage({
        //   ...selectedMessage,
        //   conversations: [...filt2],
        // });

        // setOpenTickets([
        //   ...filt,
        //   {
        //     ...filtOpened,
        //     conversations: [...filt2],
        //   },
        // ]);

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

  const communicationLoading =
    getCommunicationBookRepliesLoading ||
    getCommunicationBookRepliesFetching ||
    getCommunicationBookRepliesRefetching;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToTop = () => {
    messagesStartRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 1000);
  }, []);

  console.log({
    id,
    replyMessages,
    state,
    showScrollIcon,
    userDesignation,
    user,
    messageDeleteId,
  });

  // navigate(`${state.pathname}/edit/${id}`)

  return (
    <div>
      <div ref={messagesStartRef} />
      <div
        style={{
          padding: xss
            ? "2em 1em"
            : smm
            ? "2em 1em"
            : mdd
            ? "3em"
            : lgg
            ? "4em"
            : "4em",
          maxWidth: xss
            ? "135rem"
            : smm
            ? "135rem"
            : mdd
            ? "135rem"
            : lgg
            ? "100rem"
            : "100rem",
          //   maxWidth: "135rem",
          margin: "auto",
          backgroundColor: "#fff",
          minHeight: "85vh",
          borderRadius: "1rem",
          boxShadow: "0 0 2rem rgba(0, 0, 0, 0.04)",
          position: "relative",
        }}
      >
        <div
          className='d-flex w-100 justify-content-between align-items-center'
          style={{
            background: "#f5f5f5",
            padding: "10px 20px",
            marginBottom: "30px",
            position: "sticky",
            top: "80px",
            zIndex: 1000,
            borderRadius: "1rem",
            boxShadow: "0 0 1rem rgba(0, 0, 0, 0.2)",
          }}
        >
          <p className='fw-bold fs-3' style={{}}>
            <FontAwesomeIcon icon={faEnvelopeOpenText} className='me-2 fs-3' />{" "}
            {trimText(state?.title, xs ? 50 : sm ? 50 : md ? 50 : lg ? 50 : 50)}{" "}
            {communicationLoading && (
              <span style={{ margin: "0px 10px" }}>
                <Spinner />
              </span>
            )}
            {/* {trimText(state?.title, xs ? 40 : sm ? 40 : md ? 30 : lg ? 40 : 50)} */}
          </p>

          <div className=''>
            <button
              type='button'
              className='btn go-back-button'
              onClick={() => navigate(-1)}
            >
              <FontAwesomeIcon icon={faArrowLeft} className='me-2' /> Go Back
            </button>
          </div>
        </div>

        <div className='' style={{ minHeight: "200px" }}>
          {state?.conversations
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
              // const timeAgo2 = formatDistanceToNow(dateObject, {
              //   addSuffix: true,
              // });
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

              const checkUserChat = (function () {
                if (oc?.sender_type === userDesignation) {
                  return true;
                } else {
                  return false;
                }
              })();

              return (
                <div className='' key={i}>
                  <div
                    className={`d-flex w-100 ${
                      checkUserChat
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
                  <div
                    className={`d-flex w-100 ${
                      checkUserChat
                        ? "justify-content-start"
                        : "justify-content-end"
                    }`}
                  >
                    <div
                      className=''
                      style={{
                        //   height: "fit",
                        // maxHeight: "200px",
                        // minWidth: "300px",
                        width: xss
                          ? "75vw"
                          : smm
                          ? "75vw"
                          : mdd
                          ? "400px"
                          : lgg
                          ? "500px"
                          : "500px",
                        border: "1px solid rgba(47, 46, 65, 0.2)",
                        borderRadius: "10px",
                        padding: "15px 15px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        margin: "0px 0px 0px 0px",
                        background: checkUserChat
                          ? chatColors?.grey
                          : chatColors?.lightBlue,
                        overflow: "auto",
                      }}
                    >
                      <div className='d-flex align-items-center justify-content-between  mb-4'>
                        <div className='d-flex align-items-center gap-3'>
                          <p
                            className='fs-4 fw-bold '
                            // style={{ cursor: "pointer" }}
                            // onClick={() => open()}
                          >
                            {trimText(oc?.sender, 30)}
                          </p>
                          {oc?.file_name && (
                            <ImAttachment
                              style={{
                                color: "#01153b",
                                fontSize: "20px",
                                // cursor: "pointer",
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
                              if (typeof state?.file === "string") {
                                handleViewFile2(state?.file);
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
                        {state?.ticket_status === "active" && (
                          <div className='d-flex justify-content-end  align-items-center gap-4'>
                            {state?.sender_email === user?.email && (
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
                                    title: state?.title,
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
                                  setEditMessagePrompt2(true);
                                }}
                              />
                            )}
                            {/* {i != 0 && (
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
                            )} */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {replyMessages?.length > 0 && (
          <div
            className=''
            style={{
              minHeight: "200px",
              marginTop: "30px",
              marginBottom: "50px",
            }}
          >
            {replyMessages
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

                const checkUserChat = (function () {
                  if (oc?.sender_type === userDesignation) {
                    return true;
                  } else {
                    return false;
                  }
                })();

                return (
                  <div className='' key={i}>
                    <div
                      className={`d-flex w-100 ${
                        checkUserChat
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
                      </div>
                    </div>
                    <div
                      className={`d-flex w-100 ${
                        checkUserChat
                          ? "justify-content-start"
                          : "justify-content-end"
                      }`}
                    >
                      <div
                        className=''
                        style={{
                          //   height: "fit",
                          width: xss
                            ? "75vw"
                            : smm
                            ? "75vw"
                            : mdd
                            ? "400px"
                            : lgg
                            ? "500px"
                            : "500px",
                          border: "1px solid rgba(47, 46, 65, 0.2)",
                          borderRadius: "10px",
                          padding: "15px 15px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                          margin: "0px 0px 20px 0px",
                          background: checkUserChat
                            ? chatColors?.grey
                            : chatColors?.lightBlue,
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
                              {trimText(oc?.sender, 30)}
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
                                if (typeof state?.file === "string") {
                                  handleViewFile2(state?.file);
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
                          {state?.ticket_status === "active" && (
                            <div className='d-flex justify-content-end  align-items-center gap-4'>
                              {oc?.sender_email === user?.email && (
                                <FaEdit
                                  style={{
                                    color: "#01153b",
                                    fontSize: "25px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setMessageDeleteId(oc?.reply_id);
                                    setSelectedMessage2({
                                      ...selectedMessage2,
                                      id: oc?.reply_id,
                                      title: state?.title,
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
                                    setEditMessagePrompt(true);
                                    // if (i != 0) {
                                    // } else if (i === 0) {
                                    //   setEditMessagePrompt2(true);
                                    // }
                                  }}
                                />
                              )}
                              {oc?.sender_email === user?.email && (
                                <MdDelete
                                  style={{
                                    color: "red",
                                    fontSize: "25px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setMessageDeleteId(oc?.reply_id);
                                    setDeletePrompt2(true);
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* <div className={`d-flex w-100 justify-content-end`}>
                            <div className='mb-3 d-flex gap-2 align-items-center'>
                              <IoCheckmarkDone
                                style={{
                                  color: "#01153b",
                                  fontSize: "20px",
                                  cursor: "pointer",
                                }}
                              />
                              <p className='fs-4'>sent</p>
                            </div>
                          </div> */}
                  </div>
                );
              })}
          </div>
        )}

        {!communicationLoading && replyMessages?.length === 0 && (
          <div
            className=' d-flex justify-content-center align-items-center'
            style={{
              //   borderTop: "1px solid rgba(47, 46, 65, 0.2)",
              //   padding: "30px 0px",
              margin: "50px 0px",
              //   height: "40vh",
            }}
          >
            {<p className='fs-4'>-- No Replies --</p>}
          </div>
        )}

        {state?.ticket_status === "active" && (
          <div
            className='mt-5 d-flex justify-content-between align-items-center '
            style={{
              padding: xss
                ? "1em 1em"
                : smm
                ? "1em 1em"
                : mdd
                ? "1em 3em"
                : lgg
                ? "1em 4em"
                : "1em 4em",
              position: "absolute",
              bottom: "0px",
              marginBottom: "30px",
              right: "0px",
              left: "0px",
            }}
          >
            <div
              className=''
              style={{
                width: "100%",
              }}
            >
              <AuthInput
                className='form-control fs-3 lh-base w-100'
                type='text'
                value={replyMessage}
                placeholder='Type your response'
                onChange={(e) => setReplyMessage(e.target.value)}
                style={{ flexGrow: "1" }}
                // style={{
                //   height: "50px",
                // }}
              />
            </div>
            <Button
              // className='w-auto'
              style={{
                width: "100px",
                height: xss
                  ? "40px"
                  : smm
                  ? "38px"
                  : mdd
                  ? "50px"
                  : lgg
                  ? "50px"
                  : "50px",
                backgroundColor: chatColors?.primary,
                color: "#fff",
              }}
              isLoading={addCommunicationBookRepliesLoading}
              onClick={() => {
                if (!replyMessage) return;

                setReplyMessages((prev) => [
                  ...prev,
                  {
                    communication_id: state?.id,
                    // sender_id: state?.recipient?.sender?.id,
                    sender_id: user?.id,
                    sender_type:
                      user?.designation_name === "Student"
                        ? "Student"
                        : "Staff",
                    sender_email: user?.email,
                    sender: `${user?.firstname} ${
                      user?.surname
                    } (${designation`${user?.designation_id}`})`,
                    // receiver_id:
                    //   state?.recipient?.sender?.email === user?.email
                    //     ? 4
                    //     : state?.recipient?.sender?.id,
                    // receiver_type:
                    //   state?.recipient?.sender?.email === user?.email
                    //     ? user?.designation_name === "Student"
                    //       ? "student"
                    //       : "staff"
                    //     : "staff",
                    message: replyMessage,
                    date,
                  },
                ]);

                addCommunicationBookReplies({
                  communication_book_id: state?.id,
                  body: {
                    sender_id: user?.id,
                    receiver_id: "5",
                    message: replyMessage,
                  },
                });

                setReplyMessage("");
                // setFile(null);
                // setFileName("");
                // setTicketTab("1");
                // handleViewFile(notes?.file);
              }}
              //   variant=""
            >
              Send
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {true && (
        <div className=''>
          <div
            style={{
              position: "fixed",
              bottom: xss
                ? "140px"
                : smm
                ? "140px"
                : mdd
                ? "130px"
                : lgg
                ? "120px"
                : "120px",
              right: xss
                ? "20px"
                : smm
                ? "20px"
                : mdd
                ? "20px"
                : lgg
                ? "80px"
                : "80px",
              opacity: "50%",
              zIndex: 1000,
              backgroundColor: chatColors?.primary,
              color: "#fff",
              borderRadius: "50%",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={scrollToTop}
          >
            <FaArrowUp size={20} />
          </div>
          <div
            style={{
              position: "fixed",
              bottom: xss
                ? "95px"
                : smm
                ? "95px"
                : mdd
                ? "75px"
                : lgg
                ? "75px"
                : "75px",
              right: xss
                ? "20px"
                : smm
                ? "20px"
                : mdd
                ? "20px"
                : lgg
                ? "80px"
                : "80px",
              zIndex: 1000,
              opacity: "50%",
              backgroundColor: "#01153b",
              color: "#fff",
              borderRadius: "50%",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={scrollToBottom}
          >
            <FaArrowDown size={20} />
          </div>
        </div>
      )}

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

          {/* <p className='fs-3 fw-bold my-4'>Attachment</p>
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
          /> */}

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
    </div>
  );
};

export default CommunicationMessages;

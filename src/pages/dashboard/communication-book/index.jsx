import {
  faCalendarAlt,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { ImAttachment } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { TiPin } from "react-icons/ti";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Element, Events } from "react-scroll";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";
import styles from "../../../assets/scss/pages/dashboard/assignment.module.scss";
import Button from "../../../components/buttons/button";
import CBStudentsRow from "../../../components/common/cb-students-row";
import PageSheet from "../../../components/common/page-sheet";
import CustomFileInput2 from "../../../components/inputs/CustomFileInput2";
import AuthInput from "../../../components/inputs/auth-input";
import AuthSelect from "../../../components/inputs/auth-select";
import Prompt from "../../../components/modals/prompt";
import { useClasses } from "../../../hooks/useClasses";
import { useCommunicationBook } from "../../../hooks/useCommunicationBook";
import useMyMediaQuery from "../../../hooks/useMyMediaQuery";
import queryKeys from "../../../utils/queryKeys";
import MessageCard from "./MessageCard";
import { chatColors, designation, trimText } from "./constant";

const CommunicationBookPage = () => {
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
    className,
    setClassName,
    academicPeriod,
  } = useCommunicationBook();

  // const history = useHistory();
  const location = useLocation();
  const navigate = useNavigate();

  // const { state } = useLocation();

  // Function to get the current status from the URL query parameter
  const getStatusFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("status") || "active"; // default to 'closed' if not set
  };

  const status = getStatusFromURL();

  const user = {
    ...newUser,
    email: newUser?.email || newUser?.email_address,
  };

  // Extend Day.js with the required plugins
  dayjs.extend(customParseFormat);
  dayjs.extend(localizedFormat);

  const { xs, sm, md, lg, xl, xxl } = useMyMediaQuery();

  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);

  const [activeSection, setActiveSection] = useState("");
  const [classId, setClassId] = useState("");

  const [openMessage, setOpenMessage] = useState(false);
  const [editMessagePrompt, setEditMessagePrompt] = useState(false);
  const [editMessagePrompt2, setEditMessagePrompt2] = useState(false);

  const [deletePrompt, setDeletePrompt] = useState(false);
  const [deletePrompt2, setDeletePrompt2] = useState(false);

  const [replyMessage, setReplyMessage] = useState("");
  const [replyMessages, setReplyMessages] = useState([]);
  const [messageDeleteId, setMessageDeleteId] = useState("");
  const [ticketCloseId, setTicketCloseId] = useState("");
  const [ticketTab, setTicketTab] = useState("1");

  const [openedTitle, setOpenedTitle] = useState("");
  const [openedConversations, setOpenedConversations] = useState([]);
  const [communicationId, setCommunicationId] = useState("");
  const [loading1, setLoading1] = useState(false);

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

  function trigger(time) {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
    }, time);
  }

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

  const checkClassId = () => {
    return classes?.find((cl) => cl?.class_name === classId)?.id;
  };

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

  const studentsId = studentByClass?.map((sc, i) => {
    return {
      recipient_id: sc.id,
      receiver_type: "student",
    };
  });

  const classIdValue = (function () {
    if (
      user?.designation_name === "Teacher" ||
      user?.designation_name === "Student"
    ) {
      return user?.class_id || "";
    } else if (
      user?.department === "Admin" ||
      user?.designation_name === "Principal"
    ) {
      return classId || location?.state?.classId || "";
    }
  })();

  /////// POST COMMUNICATION BOOK ////
  const {
    mutateAsync: addCommunicationBook,
    isLoading: addCommunicationBookLoading,
  } = useMutation(
    () =>
      apiServices.addCommunicationBook({
        period: academicPeriod?.period,
        term: academicPeriod?.term,
        session: academicPeriod?.session,
        class_id: classIdValue,
        sender_id: user?.id,
        sender_type: user?.designation_name === "Student" ? "student" : "staff",
        subject: title,
        message,
        file: base64String,
        file_name: fileName,
        recipients: selectedStudent?.email_address,
      }),
    // () => apiServices.addObjectiveAssignment(finalObjectiveArray),
    {
      onSuccess() {
        refetchGetCommunicationBookByClass();
        trigger(500);
        setTimeout(() => {
          setCreateQuestionPrompt(false);
        }, 1200);
        toast.success("Communication ticket has been created successfully");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  // FETCH COMMUNICATION BOOK CREATED /////////
  const {
    isLoading: getCommunicationBookByClassLoading,
    data: getCommunicationBookByClass,
    isFetching: getCommunicationBookByClassFetching,
    isRefetching: getCommunicationBookByClassRefetching,
    refetch: refetchGetCommunicationBookByClass,
  } = useQuery(
    [queryKeys.GET_COMMUNICATION_BOOK],
    () => apiServices.getCommunicationBookByClass(classIdValue),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!classIdValue && permission?.view,

      select: (data) => {
        if (data?.data?.length > 0) {
          const dt = apiServices
            .formatData(data)
            ?.map((da, i) => {
              return {
                ...da,
                date: dayjs(da?.date, "D MMM YYYY h:mm A").format(
                  "dddd MMMM D, YYYY h:mm A"
                ),
              };
            })
            ?.filter(
              (da) =>
                da?.recipients?.sender?.email === user?.email ||
                da?.recipients?.receivers?.some(
                  (obj) => obj.email === user?.email
                )
            );

          // console.log({ data, dt });
          return dt ?? [];
        }

        // return permission?.create ? filt : lsg;
      },
      onSuccess(data) {
        // const newData = data?.map((dt, i)=>{

        // })
        // const dt = data?.data;
        // const dtId = data?.data?.id;
        const opened = data?.filter((ms) => ms?.status === "active");
        // const closed = data?.filter((ms) => ms?.status !== "active");

        if (opened?.length > 0) {
          setOpenTickets([...opened]);
        } else {
          setOpenTickets([]);
        }

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

  // FETCH CLOSED COMMUNICATION BOOK /////////
  const {
    isLoading: getClosedCommunicationBookByClassLoading,
    data: getClosedCommunicationBookByClass,
    isFetching: getClosedCommunicationBookByClassFetching,
    isRefetching: getClosedCommunicationBookByClassRefetching,
    refetch: refetchClosedGetCommunicationBookByClass,
  } = useQuery(
    [queryKeys.GET_CLOSED_COMMUNICATION_BOOK],
    () => apiServices.getClosedCommunicationBookByClass(classIdValue),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!classIdValue && permission?.view,

      select: (data) => {
        // const cdt = [{ ...data?.data?.attributes, id: data?.data?.id }]
        const cdt = apiServices
          .formatData(data)
          ?.map((da, i) => {
            return {
              ...da,
              date: dayjs(da?.date, "D MMM YYYY h:mm A").format(
                "dddd MMMM D, YYYY h:mm A"
              ),
            };
          })
          ?.filter(
            (da) =>
              da?.recipients?.sender?.email === user?.email ||
              da?.recipients?.receivers?.some(
                (obj) => obj.email === user?.email
              )
          );

        // console.log({ cdata: data, cdt });

        if (cdt?.length > 0) {
          return cdt;
        } else {
          return [];
        }

        // return permission?.create ? filt : lsg;
      },
      onSuccess(data) {
        const closed = data?.filter((ms) => ms?.status === "closed");

        if (closed?.length > 0) {
          setClosedTickets([...closed]);
        } else {
          setClosedTickets([]);
        }
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  // FETCH COMMUNICATION BOOK REPLIES /////////
  const {
    isLoading: getCommunicationBookRepliesLoading,
    data: getCommunicationBookReplies,
    isFetching: getCommunicationBookRepliesFetching,
    isRefetching: getCommunicationBookRepliesRefetching,
    refetch: refetchGetCommunicationBookReplies,
  } = useQuery(
    [queryKeys.GET_COMMUNICATION_BOOK_REPLIES],
    () => apiServices.getCommunicationBookReplies(communicationId),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!communicationId && permission?.view,

      select: (data) => {
        // console.log({ datarr: data, dtr: data?.data });

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

          // console.log({ ddt });

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

  //// CLOSE COMMUNICATION BOOK ////
  const {
    mutateAsync: closeCommunicationBook,
    isLoading: closeCommunicationBookLoading,
  } = useMutation(
    () =>
      apiServices.closeCommunicationBook({
        id: selectedMessage?.id,
      }),
    {
      onSuccess() {
        // setAllowFetch(true);
        refetchGetCommunicationBookByClass();
        trigger(500);
        // trigger(500);
        setTimeout(() => {
          setDeletePrompt(false);
        }, 1000);
        // navigate(`/app/communication-book`);

        toast.success("Ticket has been successfully closed.");
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
    }
  );

  //// FETCH STAFF BY class /////////
  const {
    isLoading: getStaffByClassLoading,
    data: getStaffByClass,
    isFetching: getStaffByClassFetching,
    isRefetching: getStaffByClassRefetching,
    refetch: refetchGetStaffByClass,
  } = useQuery(
    [queryKeys.GET_STAFF_BY_CLASS],
    () => apiServices.getStaffByClass(user?.class),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!user?.class && user?.designation_name === "Student",

      select: (data) => {
        const ct = apiServices.formatData(data)?.map((sc, i) => {
          return {
            ...sc,
            email_address: sc?.email,
            admission_number: sc?.sch_id,
            gender: "male",
          };
        });

        const staffsId = ct?.map((sc, i) => {
          return {
            recipient_id: sc.id,
            receiver_type: "staff",
          };
        });

        const newStaffsByClass = () => {
          if (ct) {
            return [
              {
                sch_id: "SCHMATE/117209",
                campus: "Corona Elementary",
                designation_id: "4",
                department: "Teaching Staff",
                surname: "Staffs",
                firstname: "All",
                middlename: "Staffs",
                username: "jane12",
                email: "janeoge@coronaschools.com",
                phoneno: "+2348026740123",
                address: "2801 Island Avenue",
                image: "",
                class_assigned: "Basics 1",
                campus_type: "Elementary",
                is_preschool: "false",
                signature: "",
                teacher_type: "",
                status: "active",
                gender: "all",
                subjects: [
                  {
                    name: "Mathematics",
                  },
                  {
                    name: "English Language",
                  },
                  {
                    name: "Computer Studies",
                  },
                  {
                    name: "Civic Education",
                  },
                ],
                plan: "PREMIUM PLAN",
                id: "99999",
                email_address: staffsId,
                recipient: "All Staffs",
                students: staffsId,
              },
              ...ct?.map((sp, i) => {
                return {
                  ...sp,
                  students: [
                    {
                      recipient_id: sp.id,
                      receiver_type: "staff",
                    },
                  ],
                };
              }),
            ];
          }
        };

        // const dt = [data?.data?.attributes];
        // const dtId = data?.data?.id;

        // const filt = csg?.filter(
        //   (ls) => Number(ls?.staff_id) === Number(user?.id)
        // );
        // console.log({
        //   datast: data?.data,
        //   data,
        //   ct,
        //   staffsId,
        //   newStaffsByClass: newStaffsByClass(),
        // });

        if (ct) {
          return newStaffsByClass();
        }

        // return permission?.create ? filt : lsg;
      },
      onSuccess(data) {
        // setLessonNotes(data);
        // trigger(1000);
      },
      onError(err) {
        apiServices.errorHandler(err);
      },
      // select: apiServices.formatData,
    }
  );

  const activateSend = () => {
    if (!message || !title) {
      return true;
    } else {
      return false;
    }
  };

  // const firstSelectedMessage = () => {
  //   if (selectedMessage?.conversations?.length > 0) {
  //     return messages[0]?.conversations[0];
  //   }
  // };

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
          email_address: studentsId,
          recipient: "All Students",
          students: studentsId,
        },
        ...studentByClass?.map((sp, i) => {
          return {
            ...sp,
            students: [
              {
                recipient_id: sp.id,
                receiver_type: "student",
              },
            ],
          };
        }),
      ];
    }
  };

  const deleteButtons = [
    {
      title: "No",
      // isLoading: closeCommunicationBookLoading,
      onClick: () => {
        // setWarningPrompt(true);
        setDeletePrompt(false);
      },
      // variant: `${activeTab === "2" ? "" : "outline"}`,
    },
    {
      title: "Yes",
      onClick: () => {
        closeCommunicationBook();
      },
      variant: "outline-danger",
      isLoading: closeCommunicationBookLoading,
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
      isLoading: addCommunicationBookLoading,
      onClick: async () => {
        // setOpenTickets((prev) => [
        //   ...prev,
        //   {
        //     id: dateString,
        //     title,
        //     ticket_status: "open",
        //     conversations: [
        //       {
        //         id: dateString,
        //         sender: `${user?.firstname} ${user?.surname} (${user?.designation_name})`,
        //         sender_email: user?.email ?? "",
        //         message,
        //         file: file,
        //         file_name: fileName,
        //         recipient_email: email_address,
        //         recipient,
        //         date,
        //         read_status: "unread",
        //       },
        //     ],
        //   },
        // ]);

        // console.log({
        //   period: user?.period,
        //   term: user?.term,
        //   session: user?.session,
        //   class_id: user?.designation_name === "Student" ? "1" : user?.class_id,
        //   sender_id: user?.id,
        //   sender_type:
        //     user?.designation_name === "Student"
        //       ? "Student"
        //       : user?.designation_name,
        //   subject: title,
        //   message,
        //   file: base64String,
        //   file_name: fileName,
        //   recipients: selectedStudent?.email_address,
        // });

        // setCreateQuestionPrompt(false);

        await addCommunicationBook();
        // trigger(500);
      },
      // variant: "outline",
    },
  ];

  const buttonOptions2 =
    selectedMessage?.ticket_status === "active"
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
            isLoading: addCommunicationBookRepliesLoading,
            onClick: async () => {
              if (!replyMessage) return;

              // const filt = openTickets?.filter(
              //   (sm) => sm?.id !== selectedMessage?.id
              // );
              // const filt2 = openTickets?.find(
              //   (sm) => sm?.id === selectedMessage?.id
              // );

              setReplyMessages((prev) => [
                ...prev,
                {
                  communication_id: selectedMessage?.id,
                  // sender_id: selectedMessage?.recipient?.sender?.id,
                  sender_id: user?.id,
                  sender_type:
                    user?.designation_name === "Student" ? "student" : "staff",
                  sender_email: user?.email,
                  sender: `${user?.firstname} ${
                    user?.surname
                  } (${designation`${user?.designation_id}`})`,
                  // receiver_id:
                  //   selectedMessage?.recipient?.sender?.email === user?.email
                  //     ? 4
                  //     : selectedMessage?.recipient?.sender?.id,
                  // receiver_type:
                  //   selectedMessage?.recipient?.sender?.email === user?.email
                  //     ? user?.designation_name === "Student"
                  //       ? "student"
                  //       : "staff"
                  //     : "staff",
                  message: replyMessage,
                  date,
                },
              ]);

              addCommunicationBookReplies({
                communication_book_id: selectedMessage?.id,
                body: {
                  sender_id: user?.id,
                  receiver_id: "4",
                  message: replyMessage,
                },
              });

              // const filtConv = selectedMessage

              // setSelectedMessage({
              //   ...selectedMessage,
              //   conversations: [
              //     ...selectedMessage?.conversations,
              //     {
              //       id: dateString,
              //       sender: selectedMessage?.sender,
              //       sender_email: selectedMessage?.sender_email,
              //       title: selectedMessage?.title,
              //       message: replyMessage,
              //       file: file,
              //       file_name: fileName,
              //       recipient_email: selectedMessage?.recipient_email,
              //       recipient: selectedMessage?.recipient,
              //       date,
              //     },
              //   ],
              // });

              // setOpenTickets([
              //   ...filt,
              //   {
              //     ...filt2,
              //     conversations: [
              //       ...selectedMessage?.conversations,
              //       {
              //         sender: selectedMessage?.sender,
              //         sender_email: selectedMessage?.sender_email,
              //         title: selectedMessage?.title,
              //         message: replyMessage,
              //         file: file,
              //         file_name: fileName,
              //         recipient_email: selectedMessage?.recipient_email,
              //         recipient: selectedMessage?.recipient,
              //         date,
              //       },
              //     ],
              //   },
              // ]);

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
    if (
      (user?.department === "Admin" ||
        user?.designation_name === "Principal") &&
      classSelected
    ) {
      return true;
    } else if (
      (user?.designation_name === "Teacher" ||
        user?.designation_name === "Student") &&
      newStudentByClass()?.length > 0
    ) {
      return true;
    }
  };

  const allLoading =
    studentByClassLoading ||
    getCommunicationBookByClassLoading ||
    // getCommunicationBookByClassFetching ||
    // getCommunicationBookByClassRefetching ||
    loading1;

  const showStudentRowWarning = () => {
    if (
      (user?.department === "Admin" ||
        user?.designation_name === "Principal") &&
      !classSelected
    ) {
      return true;
    } else if (
      (user?.designation_name === "Teacher" ||
        user?.designation_name === "Student") &&
      newStudentByClass()?.length == 0
    ) {
      return true;
    }
  };

  useEffect(() => {
    if (classSelected) {
      refetchStudentByClass();
      refetchGetCommunicationBookByClass();
      // trigger(1000);
    }
  }, [classSelected]);

  useEffect(() => {
    if (
      user?.designation_name === "Teacher" ||
      user?.designation_name === "Student"
    ) {
      // return user?.class_assigned || "";
      setClassName(user?.class_assigned);
    } else if (
      user?.department === "Admin" ||
      user?.designation_name === "Principal"
    ) {
      // return classSelected || "";
      setClassName(classSelected);
    }

    setClassSelected(location?.state?.classSelected || "");
  }, []);

  useEffect(() => {
    const handleScrollEvent = (to, element) => {
      // console.log("end", to, element);
      setActiveSection(to);
    };

    // Registering the 'begin' event and logging it to the console when triggered.

    Events.scrollEvent.register("end", handleScrollEvent);

    return () => {
      Events.scrollEvent.remove("end", handleScrollEvent);
    };
  }, []);

  const communicationLoading =
    // getCommunicationBookByClassLoading ||
    getCommunicationBookByClassFetching ||
    getCommunicationBookByClassRefetching;

  //   const allLoading = studentByClassLoading || isRefetchingStudentByClass;

  // console.log({
  //   // communicationId,
  //   // openMessage,
  //   // newStudentByClass: newStudentByClass(),
  //   // studentByClass,
  //   // studentsId,
  //   // msg,
  //   // messages,
  //   // openTickets,
  //   classIdValue,
  //   academicPeriod,
  //   classId,
  //   classes,
  //   classSelected,
  //   selectedStudent,
  //   closedTickets,
  //   message,
  //   title,
  //   showStudentRow: showStudentRow(),
  //   // selectedMessage,
  //   // selectedMessage2,
  //   // replyMessages,
  //   // ticketTab,
  //   // history,
  //   user,
  //   allLoading,
  //   location,
  //   status,
  // });

  return (
    <div className='results-sheet'>
      <PageSheet>
        <div className={styles.home}>
          <div className='d-flex align-items-center gap-3 mb-3'>
            <Button
              className='w-auto'
              onClick={() => {
                // setTicketTab("1");
                navigate(`/app/communication-book/?status=active`);
                // handleViewFile(notes?.file);
              }}
              variant={`${status === "active" ? "" : "outline"}`}
            >
              <FontAwesomeIcon icon={faCalendarAlt} /> Active Tickets
            </Button>
            <Button
              className='w-auto'
              onClick={() => {
                // setTicketTab("2");
                navigate(`/app/communication-book/?status=closed`, {
                  state: {
                    classId,
                  },
                });

                // handleViewFile(notes?.file);
              }}
              variant={`${status === "closed" ? "" : "outline"}`}
            >
              <FontAwesomeIcon icon={faCalendarCheck} /> Closed Tickets
            </Button>
            {communicationLoading && (
              <span style={{ margin: "0px 10px" }}>
                <Spinner />
              </span>
            )}
          </div>
          {(user?.department === "Admin" ||
            user?.designation_name === "Principal") && (
            <div className='d-flex col-6 col-md-3 col-lg-3'>
              <AuthSelect
                sort
                value={classSelected}
                onChange={({ target: { value } }) => {
                  setClassSelected(value);
                  setClassId(
                    classes?.find((cl) => cl?.class_name === value)?.id
                  );
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

          {!allLoading && status === "active" && (
            <div className='w-100 mt-4 border border-2 pt-4 pb-2  px-3 rounded-3 d-flex align-items-center'>
              {showStudentRow() && (
                <CBStudentsRow
                  studentByClassAndSession={
                    user?.designation_name === "Student"
                      ? getStaffByClass
                      : newStudentByClass()
                  }
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
                            ? `${x.firstname} ${x.surname}`
                            : // ? `${x.firstname} ${x.surname} in ${className}`
                              `${x.surname} ${x.firstname}`,
                        student_id: x.id,
                        email_address: x.students,
                        designation: x.teacher_type,
                      };
                    });
                  }}
                  isLoading={allLoading}
                  selectedStudent={selectedStudent}
                  user={user}
                  // idWithComputedResult={idWithComputedResult}
                />
              )}
              {showStudentRowWarning() && (
                <div className='w-100 d-flex justify-content-center align-items-center mb-3 gap-3 bg-danger bg-opacity-10 py-3 px-4'>
                  <p className='fs-4 text-danger'>
                    {user?.department === "Admin" ||
                    user?.designation_name === "Principal"
                      ? "Please select a class"
                      : "No Student in Class"}
                  </p>
                </div>
              )}
            </div>
          )}

          {allLoading && (
            <div className={styles.spinner_container}>
              <Spinner /> <p className='fs-3'>Loading...</p>
            </div>
          )}

          {!allLoading && status === "active" && (
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

          {!allLoading && status === "active" && openTickets?.length === 0 && (
            <div
              className='d-flex flex-column w-100 align-items-center justify-content-center h-100'
              style={{ minHeight: "50vh" }}
            >
              <HiOutlineDocumentPlus style={{ fontSize: "50px" }} />
              <p className='fs-1 fw-bold mt-3'>Create Ticket</p>
            </div>
          )}

          {!allLoading &&
            status === "closed" &&
            closedTickets?.length === 0 && (
              <div
                className='d-flex flex-column w-100 align-items-center justify-content-center h-100'
                style={{ minHeight: "50vh" }}
              >
                <HiOutlineDocumentPlus style={{ fontSize: "50px" }} />
                <p className='fs-1 fw-bold mt-3'>No Ticket</p>
              </div>
            )}

          {!allLoading &&
            status === "active" &&
            openTickets
              ?.filter((ms) => ms?.status === "active")
              ?.sort((a, b) => {
                if (new Date(a.date) < new Date(b.date)) {
                  return 1;
                }
                if (new Date(a.date) > new Date(b.date)) {
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
                      openMessage={openMessage}
                      setOpenMessage={setOpenMessage}
                      setSelectedMessage={setSelectedMessage}
                      setFile={setFile}
                      setFileName={setFileName}
                      setReplyMessage={setReplyMessage}
                      user={user}
                      setDeletePrompt={setDeletePrompt}
                      setTicketCloseId={setTicketCloseId}
                      // ticketTab={ticketTab}
                      apiServices={apiServices}
                      allStaffs={[]}
                      replyMessages={replyMessages}
                      setReplyMessages={setReplyMessages}
                      refetchGetCommunicationBookReplies={
                        refetchGetCommunicationBookReplies
                      }
                      communicationId={communicationId}
                      setCommunicationId={setCommunicationId}
                      getCommunicationBookRepliesLoading={
                        getCommunicationBookRepliesLoading
                      }
                      getCommunicationBookRepliesFetching={
                        getCommunicationBookRepliesFetching
                      }
                      getCommunicationBookRepliesRefetching={
                        getCommunicationBookRepliesRefetching
                      }
                      status={status}
                      classSelected={classSelected}
                      classId={classId}
                    />
                  </div>
                );
              })}

          {!allLoading &&
            status === "closed" &&
            closedTickets
              ?.filter((ms) => ms?.status === "closed")
              ?.sort((a, b) => {
                if (new Date(a.date) < new Date(b.date)) {
                  return 1;
                }
                if (new Date(a.date) > new Date(b.date)) {
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
                      openMessage={openMessage}
                      setOpenMessage={setOpenMessage}
                      setSelectedMessage={setSelectedMessage}
                      setFile={setFile}
                      setFileName={setFileName}
                      setReplyMessage={setReplyMessage}
                      user={user}
                      setDeletePrompt={setDeletePrompt}
                      setTicketCloseId={setTicketCloseId}
                      // ticketTab={ticketTab}
                      apiServices={apiServices}
                      allStaffs={[]}
                      replyMessages={replyMessages}
                      setReplyMessages={setReplyMessages}
                      refetchGetCommunicationBookReplies={
                        refetchGetCommunicationBookReplies
                      }
                      communicationId={communicationId}
                      setCommunicationId={setCommunicationId}
                      getCommunicationBookRepliesLoading={
                        getCommunicationBookRepliesLoading
                      }
                      getCommunicationBookRepliesFetching={
                        getCommunicationBookRepliesFetching
                      }
                      getCommunicationBookRepliesRefetching={
                        getCommunicationBookRepliesRefetching
                      }
                      status={status}
                      classSelected={classSelected}
                      classId={classId}
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
          showFooter={true}
          // showFooter={selectedMessage?.sender_email === user?.email}
          // singleButtonText='Preview'
          promptHeader={
            <p className='w-100' style={{}}>
              {trimText(
                selectedMessage?.title,
                xs ? 40 : sm ? 40 : md ? 30 : lg ? 40 : 50
              )}
              {communicationLoading && (
                <span style={{ margin: "0px 10px" }}>
                  <Spinner />
                </span>
              )}
            </p>
          }
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
                    if (oc?.sender_email === user?.email) {
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
                                  if (
                                    typeof selectedMessage?.file === "string"
                                  ) {
                                    handleViewFile2(selectedMessage?.file);
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
                            {selectedMessage?.ticket_status === "active" && (
                              <div className='d-flex justify-content-end  align-items-center gap-4'>
                                {selectedMessage?.sender_email ===
                                  user?.email && (
                                  <FaEdit
                                    style={{
                                      color: "#01153b",
                                      fontSize: "25px",
                                      cursor: "pointer",
                                    }}
                                    // onClick={() => {
                                    //   setMessageDeleteId(oc?.id);
                                    //   setSelectedMessage2({
                                    //     ...selectedMessage2,
                                    //     id: oc?.id,
                                    //     title: selectedMessage?.title,
                                    //     message: oc?.message,
                                    //     date: oc?.date,
                                    //     sender: oc?.sender,
                                    //     sender_email: oc?.sender_email,
                                    //     recipient: oc?.recipient,
                                    //     recipient_email: oc?.recipient_email,
                                    //     file: oc?.file,
                                    //     file_name: oc?.file_name,
                                    //     ticket_status: oc?.ticket_status,
                                    //   });
                                    //   setFile(oc?.file);
                                    //   setFileName(oc?.file_name);
                                    //   if (i != 0) {
                                    //     setEditMessagePrompt(true);
                                    //   } else if (i === 0) {
                                    //     setEditMessagePrompt2(true);
                                    //   }
                                    // }}
                                  />
                                )}
                                {i != 0 && (
                                  <MdDelete
                                    style={{
                                      color: "red",
                                      fontSize: "25px",
                                      cursor: "pointer",
                                    }}
                                    // onClick={() => {
                                    //   setMessageDeleteId(oc?.id);
                                    //   setDeletePrompt2(true);
                                    // }}
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

            {replyMessages?.length > 0 && (
              <div className='mt-4' style={{ minHeight: "200px" }}>
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
                      if (oc?.sender_email === user?.email) {
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
                                    cursor: oc?.file_name
                                      ? "pointer"
                                      : "default",
                                  }}
                                  onClick={() => {
                                    if (
                                      typeof selectedMessage?.file === "string"
                                    ) {
                                      handleViewFile2(selectedMessage?.file);
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
                              {selectedMessage?.ticket_status === "active" && (
                                <div className='d-flex justify-content-end  align-items-center gap-4'>
                                  {oc?.sender_email === user?.email && (
                                    <FaEdit
                                      style={{
                                        color: "#01153b",
                                        fontSize: "25px",
                                        cursor: "pointer",
                                      }}
                                      // onClick={() => {
                                      //   setMessageDeleteId(oc?.id);
                                      //   setSelectedMessage2({
                                      //     ...selectedMessage2,
                                      //     id: oc?.id,
                                      //     title: selectedMessage?.title,
                                      //     message: oc?.message,
                                      //     date: oc?.date,
                                      //     sender: oc?.sender,
                                      //     sender_email: oc?.sender_email,
                                      //     recipient: oc?.recipient,
                                      //     recipient_email: oc?.recipient_email,
                                      //     file: oc?.file,
                                      //     file_name: oc?.file_name,
                                      //     ticket_status: oc?.ticket_status,
                                      //   });
                                      //   setFile(oc?.file);
                                      //   setFileName(oc?.file_name);
                                      //   if (i != 0) {
                                      //     setEditMessagePrompt(true);
                                      //   } else if (i === 0) {
                                      //     setEditMessagePrompt2(true);
                                      //   }
                                      // }}
                                    />
                                  )}
                                  {oc?.sender_email === user?.email && (
                                    <MdDelete
                                      style={{
                                        color: "red",
                                        fontSize: "25px",
                                        cursor: "pointer",
                                      }}
                                      // onClick={() => {
                                      //   setMessageDeleteId(oc?.id);
                                      //   setDeletePrompt2(true);
                                      // }}
                                    />
                                  )}
                                </div>
                              )}
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
                        </Element>
                      </div>
                    );
                  })}
              </div>
            )}

            {!communicationLoading && replyMessages?.length === 0 && (
              <div
                className='mt-1 d-flex justify-content-center align-items-center'
                style={{
                  borderTop: "1px solid rgba(47, 46, 65, 0.2)",
                  padding: "30px 0px",
                }}
              >
                {<p className='fs-4'>-- No Replies --</p>}
              </div>
            )}

            {selectedMessage?.ticket_status === "active" && (
              // selectedMessage?.sender_email === user?.email &&
              <div
                className='mt-0'
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

                {/* <div className='mt-3'>
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
                </div> */}
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

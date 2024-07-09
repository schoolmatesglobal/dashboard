import React, { useEffect } from "react";
import TimeAgo from "react-timeago";
import { parse, formatDistanceToNow } from "date-fns";
import dayjs from "dayjs";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import useMyMediaQuery2 from "../../../hooks/useMyMediaQuery2";
import { designation, extractFileName, trimText } from "./constant";
import Button from "../../../components/buttons/button";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import queryKeys from "../../../utils/queryKeys";

import { useLocation, useNavigate, useHistory } from "react-router-dom";

const MessageCard = ({
  message,
  messages,
  openMessage,
  setOpenMessage,
  setSelectedMessage,
  setFile,
  setFileName,
  setReplyMessage,
  user,
  setDeletePrompt,
  openTickets,
  setOpenTickets,
  setMessages,
  selectedMessage,
  setTicketCloseId,
  // ticketTab,
  apiServices,
  allStaffs,
  replyMessages,
  setReplyMessages,
  refetchGetCommunicationBookReplies,
  communicationId,
  setCommunicationId,
  getCommunicationBookRepliesLoading,
  getCommunicationBookRepliesFetching,
  getCommunicationBookRepliesRefetching,
  status,
  classSelected,
  classId,
}) => {
  const { xs, sm, md, lg, xl, xxl } = useMyMediaQuery2();

  const navigate = useNavigate();

  // const mssg = () => {
  //   if (message?.conversations?.length > 0) {
  //     const sortConv = message?.conversations?.sort((a, b) => {
  //       if (new Date(a?.date) < new Date(b?.date)) {
  //         return -1;
  //       }
  //       if (new Date(a?.date) > new Date(b?.date)) {
  //         return 1;
  //       }
  //       return 0;
  //     });
  //     return sortConv[0];
  //   }
  // };

  const staffDetails = allStaffs?.find(
    (as) => Number(as?.id) === Number(message?.staff_id)
  );

  const dateObject = new Date(message?.date);

  const timeAgo = formatDistanceToNow(dateObject, {
    addSuffix: true,
  });

  const hoverStyle = {
    transform: "translateY(5px)",
  };

  //   const trimText = (text, charLimit) => {
  //     if (text.length > charLimit) {
  //       return text.slice(0, charLimit) + "...";
  //     }
  //     return text;
  //   };

  const unRead = message?.conversations?.filter(
    (ms) => ms.read_status === "unread"
  )?.length;

  const closeticket = () => {};

  const editOpen = () => {
    setDeletePrompt(true);
    setFile(null);
    setFileName("");
    setReplyMessage("");
    setSelectedMessage((prev) => {
      return {
        ...prev,
        id: message?.id,
        title: message?.title,
        message: message?.message,
        date: message?.date,
        sender: message?.sender,
        sender_email: message?.sender_email,
        recipient: message?.recipient,
        recipient_email: message?.recipient_email,
        conversations: message?.conversations,
      };
    });
  };

  // const designation = (id) => {
  //   // if (message?.recipients?.sender?.designation == 4) {
  //   if (id == 7) {
  //     return "Student";
  //   } else {
  //     return "Staff";
  //   }
  // };

  const senderDetails = (function () {
    if (message?.recipients) {
      return message?.recipients?.sender;
    }
  })();

  const receiverDetails = (function () {
    if (message?.recipients?.receivers?.length > 0) {
      return message?.recipients?.receivers;
    }
  })();

  const sender_designation = message?.recipients?.sender?.designation;
  const receiever_designation =
    message?.recipients?.receivers?.length > 0
      ? message?.recipients?.receivers[0]?.designation
      : null;

  const receiver_name = (function () {
    if (message?.recipients?.receivers?.length > 0) {
      if (message?.recipients?.receivers?.length > 1) {
        return `All ${designation(receiever_designation)}s`;
      } else {
        return `${message?.recipients?.receivers[0]?.first_name} ${
          message?.recipients?.receivers[0]?.last_name
        }  ${
          designation(receiever_designation)
            ? ` (${designation(receiever_designation)})`
            : null
        }`;
      }
    }
  })();

  const open = () => {
    setFile(null);
    setFileName("");
    setReplyMessage("");

    setCommunicationId(message?.id);

    setSelectedMessage((prev) => {
      return {
        ...prev,
        id: message?.id,
        title: message?.subject,
        ticket_status: message?.status,
        conversations: [
          {
            id: message?.id,
            sender: `${message?.recipients?.sender?.first_name} ${
              message?.recipients?.sender?.last_name
            } ${
              designation(sender_designation)
                ? ` (${designation(sender_designation)})`
                : null
            }`,
            sender_email: message?.recipients?.sender?.email,
            message: message?.message,
            file: message?.attachment,
            file_name: extractFileName(message?.attachment),
            recipient_email: ["romelu@lukaku.com"],
            recipient: receiver_name,
            date: message?.date,
            read_status: "read",
          },
        ],
        file: message?.attachment,
        file_name: message?.file_name,
        // file_name: extractFileName(message?.attachment),
        message: message?.message,
        date: message?.date,
        sender: `${message?.recipients?.sender?.first_name} ${
          message?.recipients?.sender?.last_name
        } ${
          designation(sender_designation)
            ? `(${designation(sender_designation)})`
            : null
        }`,
        sender_email: senderDetails?.email,
        recipient: message?.recipients,
        recipient_email: "",
        communication_id: message?.id,
        // recipient: message?.recipient,
        // recipient_email: message?.recipient_email,
      };
    });

    if (communicationId) {
      refetchGetCommunicationBookReplies();
    }

    navigate(`/app/communication-book/${message?.id}`, {
      state: {
        status,
        id: message?.id,
        title: message?.subject,
        ticket_status: message?.status,
        classSelected,
        classId,
        conversations: [
          {
            id: message?.id,
            title: message?.subject,
            sender: `${message?.recipients?.sender?.first_name} ${
              message?.recipients?.sender?.last_name
            } ${
              designation(sender_designation)
                ? `(${designation(sender_designation)})`
                : null
            }`,
            sender_email: message?.recipients?.sender?.email,
            sender_type: designation(sender_designation),
            message: message?.message,
            file: message?.attachment,
            file_name: message?.file_name,
            recipient_email: ["romelu@lukaku.com"],
            recipient: receiver_name,
            date: message?.date,
            read_status: "read",
          },
        ],
        file: message?.attachment,
        file_name: extractFileName(message?.attachment),
        message: message?.message,
        date: message?.date,
        sender: `${message?.recipients?.sender?.first_name} ${
          message?.recipients?.sender?.last_name
        } ${
          designation(sender_designation)
            ? ` (${designation(sender_designation)})`
            : null
        }`,
        sender_email: senderDetails?.email,
        recipient: message?.recipients,
        recipient_email: "",
        communication_id: message?.id,
      },
    });

    // setOpenMessage(true);

    // if (replyMessages?.length >= 0) {
    // }

    // const filt2 = openTickets?.conversations
    // const filt =
    //   openTickets?.filter((mf) => mf.id === selectedMessage.id) ?? [];
    // const filt2 =
    //   openTickets?.filter((mf) => mf.id !== selectedMessage.id) ?? [];

    // const newMessages = filt?.map((ms, i) => {
    //   const filtConv = ms.conversations?.map((cs, i) => {
    //     return {
    //       ...cs,
    //       status: "read",
    //     };
    //   });

    //   return {
    //     ...ms,
    //     conversations: filtConv,
    //   };
    // });

    // setOpenTickets([...filt2, ...newMessages]);
  };

  useEffect(() => {
    if (openMessage === false) {
      setCommunicationId("");
      setReplyMessages([]);
    }
  }, [openMessage]);

  // console.log({ message, allStaffs, staffDetails });

  //   dayjs(new Date()).format("dddd, MMMM D, YYYY h:mm A")

  return (
    <div
      style={{
        border: "1px solid rgba(47, 46, 65, 0.2)",
        borderRadius: "10px",
        padding: "30px 30px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        transition: "transform 0.3s ease-in-out",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = hoverStyle.transform)
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      className='w-100 bg-white '
    >
      <div
        className='d-flex justify-content-between align-items-center'
        style={{
          borderBottom: "1px solid rgba(47, 46, 65, 0.2)",
          paddingBottom: "15px",
        }}
      >
        <div className='d-flex align-items-center gap-3'>
          <p
            className='fs-3 fw-bold'
            // style={{ cursor: "pointer" }}
            // onClick={() => open()}
          >
            {trimText(
              message?.subject,
              xs ? 20 : sm ? 30 : md ? 50 : lg ? 40 : 60
            )}
          </p>
          {status === "active" && unRead > 0 && (
            <div
              className='d-flex justify-content-center align-items-center '
              style={{
                background: "green",
                height: "20px",
                width: "20px",
                border: "1px solid #96ff9a",
                borderRadius: "50%",
                padding: "10px",
              }}
            >
              <p className='fw-bold text-white'>{unRead}</p>
            </div>
          )}
        </div>
        {/* <p className='fs-3 fw-bold'>{dayjs(message?.date).format("dddd, MMMM D")}</p> */}
        <p className='fs-3 fw-bold'>{timeAgo}</p>
      </div>
      <div
        className='d-flex flex-column  flex-md-row justify-content-md-between align-items-md-start mt-4'
        style={{
          borderBottom: "1px solid rgba(47, 46, 65, 0.2)",
          paddingBottom: "15px",
        }}
      >
        <p
          className='fs-3 lh-base'
          style={{
            maxWidth: xs ? "100%" : sm ? "100%" : "60vw",
            // cursor: "pointer",
          }}
          // onClick={() => open()}
        >
          {trimText(message?.message, 300)}
        </p>
        {/* <div className='d-flex align-items-center gap-3 mt-3 mt-md-0'>
          <div
            className='d-flex justify-content-center align-items-center '
            style={{
              background: "#01153b",
              height: "25px",
              width: "25px",
              border: "3px solid #367fa9",
              borderRadius: "50%",
              padding: "10px",
            }}
          >
            <p className='fw-bold text-white'>
              0
            </p>
          </div>
          <p className='d-flex d-md-none'>Messages</p>
        </div> */}
      </div>

      <div className='d-flex flex-column gap-3 flex-md-row justify-content-md-between align-items-md-center mt-4'>
        <div className='d-flex flex-column flex-md-row gap-3 align-items-md-center mb-3 mb-md-0'>
          <p className='fs-4'>
            <span className='fw-bold fs-4'>From: </span>
            {message?.recipients?.sender?.first_name}{" "}
            {message?.recipients?.sender?.last_name}
            {designation(sender_designation)
              ? ` (${designation(sender_designation)})`
              : null}
          </p>

          <p className='fs-4 fw-bold d-none d-md-inline'>|</p>

          <p className='fs-4'>
            <span className='fw-bold fs-4'>To: </span>
            {receiver_name}{" "}
            {/* {designation(receiever_designation)
              ? ` (${designation(receiever_designation)})`
              : null} */}
          </p>
        </div>
        {/* <p className='fs-3 fw-bold'>{dayjs(message?.date).format("dddd, MMMM D")}</p> */}
        {
          <div className='d-flex justify-content-end  align-items-center gap-4'>
            {/* <MdDelete
              style={{ color: "red", fontSize: "25px", cursor: "pointer" }}
              onClick={() => {
                setDeletePrompt(true);
                editOpen();
              }}
            /> */}

            <Button variant='' className='w-auto' onClick={() => open()}>
              View
            </Button>
            {message?.recipients?.sender?.email === user?.email &&
              status === "active" && (
                // {message?.ticket_status === "open" && (
                <Button
                  variant='outline'
                  className='w-auto'
                  onClick={() => {
                    editOpen();
                  }}
                >
                  Close Ticket
                </Button>
              )}
          </div>
        }
      </div>
    </div>
  );
};

export default MessageCard;

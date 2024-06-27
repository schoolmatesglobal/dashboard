import React from "react";
import TimeAgo from "react-timeago";
import { parse, formatDistanceToNow } from "date-fns";
import dayjs from "dayjs";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import useMyMediaQuery2 from "../../../hooks/useMyMediaQuery2";
import { trimText } from "./constant";
import Button from "../../../components/buttons/button";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import queryKeys from "../../../utils/queryKeys";

const MessageCard = ({
  message,
  messages,
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
  ticketTab,
  apiServices,
  allStaffs,
}) => {
  const { xs, sm, md, lg, xl, xxl } = useMyMediaQuery2();

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

  const open = () => {
    setOpenMessage(true);
    setFile(null);
    setFileName("");
    setReplyMessage("");

    // const filt2 = openTickets?.conversations
    const filt =
      openTickets?.filter((mf) => mf.id === selectedMessage.id) ?? [];
    const filt2 =
      openTickets?.filter((mf) => mf.id !== selectedMessage.id) ?? [];

    const newMessages = filt?.map((ms, i) => {
      const filtConv = ms.conversations?.map((cs, i) => {
        return {
          ...cs,
          status: "read",
        };
      });

      return {
        ...ms,
        conversations: filtConv,
      };
    });

    setOpenTickets([...filt2, ...newMessages]);

    setSelectedMessage((prev) => {
      return {
        ...prev,
        id: message?.id,
        title: message?.title,
        ticket_status: message?.ticket_status,
        conversations: message?.conversations,
        message: message?.message,
        date: message?.date,
        sender: message?.sender,
        sender_email: message?.sender_email,
        recipient: message?.recipient,
        recipient_email: message?.recipient_email,
      };
    });
  };

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

  const designation = () => {
    if (staffDetails.designation_id === 4) {
      return "Teacher";
    } else if (staffDetails.designation_id === 7) {
      return null;
    } else if (
      staffDetails.designation_id !== 4 ||
      staffDetails.designation_id !== 4
    ) {
      return "Principal";
    }
  };

  console.log({ message, allStaffs, staffDetails });

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
            style={{ cursor: "pointer" }}
            onClick={() => open()}
          >
            {trimText(
              message?.subject,
              xs ? 20 : sm ? 30 : md ? 50 : lg ? 40 : 60
            )}
          </p>
          {ticketTab === "1" && unRead > 0 && (
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
            cursor: "pointer",
          }}
          onClick={() => open()}
        >
          {trimText(message?.message, 300)}
        </p>
        <div className='d-flex align-items-center gap-3 mt-3 mt-md-0'>
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
            {/* <p className='fw-bold text-white'>
              {message?.conversations?.length}
            </p> */}
          </div>
          <p className='d-flex d-md-none'>Messages</p>
        </div>
      </div>

      <div className='d-flex flex-column  flex-md-row justify-content-md-between align-items-md-center mt-4'>
        <div className='d-flex flex-column flex-md-row gap-3 align-items-md-center mb-3 mb-md-0'>
          <p className='fs-4'>
            <span className='fw-bold fs-4'>From: </span>
            {/* {message?.sender} */}
            {staffDetails?.attributes?.firstname}{" "}
            {staffDetails?.attributes?.surname}{" "}
            {designation() ? `(${designation()})` : null}
          </p>

          <p className='fs-4 fw-bold d-none d-md-inline'>|</p>

          <p className='fs-4'>
            <span className='fw-bold fs-4'>To: </span>
            {message?.recipient} sts
          </p>
        </div>
        {/* <p className='fs-3 fw-bold'>{dayjs(message?.date).format("dddd, MMMM D")}</p> */}
        {message?.sender_email === user?.email && (
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
            {message?.ticket_status === "open" && (
              <Button
                variant='outline'
                className='w-auto'
                onClick={() => {
                  // editOpen();
                }}
              >
                Close Ticket
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;

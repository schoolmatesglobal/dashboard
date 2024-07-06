export const trimText = (text, charLimit) => {
  if (text?.length > charLimit) {
    return text?.slice(0, charLimit) + "...";
  }
  return text;
};

export const designation = (id) => {
  // if (message?.recipients?.sender?.designation == 4) {
  if (Number(id) === 7) {
    return "Student";
  } else {
    return "Staff";
  }
};

export function extractFileName(url) {
  // Split the URL by the "/" character and get the last element
  const parts = url?.split("/");
  const fileName = parts[parts?.length - 1];
  return fileName;
}

export const chatColors = {
  grey: "#e0e0e0",
  lightBlue: "#cfedff",
  primary: "#01153b",
};

export const msg = [
  {
    id: "3",
    title: "Library Book Return",
    ticket_status: "open",
    conversations: [
      {
        id: "cm31",
        sender: "Jane Obi (Teacher)",
        sender_email: "janeoge@coronaschools.com",
        message:
          "This is a reminder to return all borrowed library books by the end of this week.",
        file: "https://staging.sapsms.com/public/lessonnote/SCHMATE117209/665788d6cc3b5.pdf",
        file_name: "overdue_books_list.pdf",
        recipient_email: ["romelu@lukaku.com"],
        recipient: "Jane Lukaku",
        date: "Sunday, June 2, 2024 2:30 PM",
        read_status: "read",
      },
      {
        id: "cm32",
        sender: "Jane Lukaku",
        sender_email: "romelu@lukaku.com",
        // title: "Library Book Return",
        message:
          "Thank you Mrs Jane, My boy will return the maths textbooks on Friday.",
        file: "https://staging.sapsms.com/public/lessonnote/SCHMATE117209/665788d6cc3b5.pdf",
        file_name: "",
        recipient_email: ["janeoge@coronaschools.com"],
        recipient: "Jane Obi (Teacher)",
        date: "Monday, June 3, 2024 8:30 AM",
        read_status: "unread",
      },
    ],
  },
  //   {
  //     id: "1",
  //     title: "PTA Meeting",
  //     sender: "Jane Obi (Teacher)",
  //     sender_email: "janeoge@coronaschools.com",
  //     // message:
  //     //   "Dear parents, please be reminded of the upcoming PTA meeting scheduled for Friday. We look forward to your attendance.",
  //     // recipient_email: [
  //     //   "kike@coronaschools.com",
  //     //   "alexbriab@coronaschools.com",
  //     //   "www@gmail.com",
  //     //   "onyedikachukwu62@gmail.com",
  //     //   "romelu@lukaku.com",
  //     //   "adam@adamma.com",
  //     //   "stevejobs@jobs.com",
  //     //   "vb@gmail.com",
  //     //   "kaka@ka.po",
  //     //   "shegs@sdkjh.po",
  //     //   "emeka@offor.com",
  //     //   "rz@omole.po",
  //     // ],
  //     recipient: "All Students in Basics 1",
  //     date: "Monday, June 3, 2024 8:11 PM",
  //     conversations: [
  //       {
  //         id: "cm11",
  //         sender: "Jane Obi (Teacher)",
  //         sender_email: "janeoge@coronaschools.com",
  //         title: "PTA Meeting",
  //         message:
  //           "Dear parents, please be reminded of the upcoming PTA meeting scheduled for Friday. We look forward to your attendance.",
  //         file: "https://staging.sapsms.com/public/lessonnote/SCHMATE117209/665788d6cc3b5.pdf",
  //         file_name: "PTA_Agenda.pdf",
  //         recipient_email: [
  //           "kike@coronaschools.com",
  //           "alexbriab@coronaschools.com",
  //           "www@gmail.com",
  //           "onyedikachukwu62@gmail.com",
  //           "romelu@lukaku.com",
  //           "adam@adamma.com",
  //           "stevejobs@jobs.com",
  //           "vb@gmail.com",
  //           "kaka@ka.po",
  //           "shegs@sdkjh.po",
  //           "emeka@offor.com",
  //           "rz@omole.po",
  //         ],
  //         recipient: "All Students in Basics 1",
  //         date: "Monday, June 3, 2024 8:11 PM",
  //         status: "read",
  //       },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     sender: "Jane Obi (Teacher)",
  //     sender_email: "janeoge@coronaschools.com",
  //     title: "School Picnic",
  //     message:
  //       "We are excited to announce the annual school picnic. Please find the details in the attached flyer.",
  //     recipient_email: ["alexbriab@coronaschools.com"],
  //     recipient: "Daniel Lucky",
  //     date: "Monday, June 3, 2024 12:15 AM",
  //     conversations: [
  //       {
  //         id: "cm21",
  //         sender: "Jane Obi (Teacher)",
  //         sender_email: "janeoge@coronaschools.com",
  //         title: "School Picnic",
  //         message:
  //           "We are excited to announce the annual school picnic. Please find the details in the attached flyer.",
  //         file: "https://staging.sapsms.com/public/lessonnote/SCHMATE117209/665788d6cc3b5.pdf",
  //         file_name: "picnic_flyer.jpeg",
  //         recipient_email: ["alexbriab@coronaschools.com"],
  //         recipient: "Daniel Lucky",
  //         date: "Monday, June 3, 2024 12:15 AM",
  //         status: "read",
  //       },
  //       {
  //         id: "cm22",
  //         sender: "Daniel Lucky",
  //         sender_email: "alexbriab@coronaschools.com",
  //         title: "School Picnic",
  //         message:
  //           "Thank you Mr John for the information, this is Mrs Lucky, i will go through it.",
  //         file: "https://staging.sapsms.com/public/lessonnote/SCHMATE117209/665788d6cc3b5.pdf",
  //         file_name: "",
  //         recipient_email: ["alexbriab@coronaschools.com"],
  //         recipient: "Daniel Lucky",
  //         date: "Monday, June 3, 2024 8:20 PM",
  //         status: "unread",
  //       },
  //       {
  //         id: "cm23",
  //         sender: "Daniel Lucky",
  //         sender_email: "alexbriab@coronaschools.com",
  //         title: "School Picnic",
  //         message:
  //           "Please can i make an installmental payment to the school. Thank you.",
  //         file: "https://staging.sapsms.com/public/lessonnote/SCHMATE117209/665788d6cc3b5.pdf",
  //         file_name: "",
  //         recipient_email: ["alexbriab@coronaschools.com"],
  //         recipient: "Daniel Lucky",
  //         date: "Monday, June 3, 2024 8:22 PM",
  //         status: "unread",
  //       },
  //       {
  //         id: "cm24",
  //         sender: "Jane Obi (Teacher)",
  //         sender_email: "janeoge@coronaschools.com",
  //         title: "School Picnic",
  //         message: "Of course Ma. Thanks.",
  //         file: "https://staging.sapsms.com/public/lessonnote/SCHMATE117209/665788d6cc3b5.pdf",
  //         file_name: "",
  //         recipient_email: ["alexbriab@coronaschools.com"],
  //         recipient: "Daniel Lucky",
  //         date: "Tuesday, June 4, 2024 8:15 AM",
  //         status: "read",
  //       },
  //     ],
  //   },

  //   {
  //     id: "4",
  //     sender: "Jane Obi (Teacher)",
  //     sender_email: "janeoge@coronaschools.com",
  //     title: "Sports Day",
  //     message:
  //       "Our annual Sports Day is coming up! Ensure your child is prepared with the necessary sports gear.",
  //     recipient_email: ["michael.jones@gmail.com"],
  //     recipient: "Michael Jones",
  //     date: "Monday, June 3, 2024 9:00 AM",
  //     conversations: [
  //       {
  //         id: "cm41",
  //         sender: "Jane Obi (Teacher)",
  //         sender_email: "janeoge@coronaschools.com",
  //         title: "Sports Day",
  //         message:
  //           "Our annual Sports Day is coming up! Ensure your child is prepared with the necessary sports gear.",
  //         file: "https://staging.sapsms.com/public/lessonnote/SCHMATE117209/665788d6cc3b5.pdf",
  //         file_name: "sports_day_schedule.pdf",
  //         recipient_email: ["michael.jones@gmail.com"],
  //         recipient: "Michael Jones",
  //         date: "Monday, June 3, 2024 9:00 AM",
  //         status: "read",
  //       },
  //     ],
  //   },
  //   {
  //     id: "5",
  //     sender: "Jane Obi (Teacher)",
  //     sender_email: "janeoge@coronaschools.com",
  //     title: "Art Exhibition",
  //     message:
  //       "You are cordially invited to our annual Art Exhibition showcasing students' artwork.",
  //     recipient_email: ["emma.watson@gmail.com"],
  //     recipient: "Emma Watson",
  //     date: "Saturday, June 1, 2024 11:00 AM",
  //     conversations: [
  //       {
  //         id: "cm51",
  //         sender: "Jane Obi (Teacher)",
  //         sender_email: "janeoge@coronaschools.com",
  //         title: "Art Exhibition",
  //         message:
  //           "You are cordially invited to our annual Art Exhibition showcasing students' artwork.",
  //         file: "https://staging.sapsms.com/public/lessonnote/SCHMATE117209/665788d6cc3b5.pdf",
  //         file_name: "art_exhibition_invite.jpeg",
  //         recipient_email: ["emma.watson@gmail.com"],
  //         recipient: "Emma Watson",
  //         date: "Friday, June 1, 2024 11:00 AM",
  //         status: "read",
  //       },
  //     ],
  //   },
];

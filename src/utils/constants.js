import {
  faBookmark,
  faBuilding,
  faBuildingColumns,
  faClipboardUser,
  faComment,
  faFileInvoice,
  faGraduationCap,
  faHome,
  faPaperPlane,
  faPeopleGroup,
  faScaleBalanced,
  faEnvelope,
  faSchool,
  faAddressCard,
  faShoppingBasket,
  faTruck,
  faMoneyBill,
  faMarker,
  faChartArea,
  faCalendarDays,
  faSchoolLock,
  faTimeline,
  faBusSimple,
  faChartSimple,
  faChildren,
  faBalanceScale,
  faReceipt,
  faBook,
  faDesktop,
  faPersonSwimming,
  faSquarePollHorizontal,
  faSquarePollVertical,
  faBookBookmark,
  faEnvelopeOpenText,
  faChalkboardUser,
} from "@fortawesome/free-solid-svg-icons";

// export const backendAPI = process.env.REACT_APP_API_URL;
// const url1 = "https://goshenpillarsportal.schoolmateglobal.com/esc/api";
const url1 = "https://staging.sapsms.com/api";
const url2 = "https://dashboard.sapsms.com/api";
// const url2 = "https://staging.sapsms.com/api";
// const url2 = "https://goshenpillarsportal.schoolmateglobal.com/esc/api";

export const backendAPI = (function () {
  if (window.location.href.includes("https://staging.schoolmateglobal.com")) {
    return url1; // Update with your development API URL
  } else if (
    window.location.href.includes("https://portal.schoolmateglobal.com")
  ) {
    return url2;
  } else if (window.location.href.includes("https://schoolmates.vercel.app/")) {
    return url2;
  } else {
    return url2;
  }
})();

export const queryOptions = {
  retry: 1,
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  staleTime: 24 * 60 * 60 * 1000,
};

export const userRole = (id, sentenceCase) => {
  if (id === "1") {
    return sentenceCase ? "Admin" : "admin";
  } else if (id === "2") {
    return sentenceCase ? "Account" : "account";
  } else if (id === "3") {
    return sentenceCase ? "Principal" : "principal";
  } else if (id === "4") {
    return sentenceCase ? "Teacher" : "teacher";
  } else if (id === "6") {
    return sentenceCase ? "Superadmin" : "superadmin";
  } else if (id === "7") {
    return sentenceCase ? "Student" : "student";
  }
};

export const uniqueArray = (array, value, value2) => {
  if (value2) {
    return (
      array.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              String(t[value]).toLowerCase() ===
                String(item[value]).toLowerCase() &&
              String(t[value2]).toLowerCase() ===
                String(item[value2]).toLowerCase()
          )
      ) ?? []
    );
  } else {
    return (
      array.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              String(t[value]).toLowerCase() ===
              String(item[value]).toLowerCase()
          )
      ) ?? []
    );
  }
};

export const sortArray = (data, key, order = "asc", sortType = "string") => {
  return [...data].sort((a, b) => {
    let valueA = a[key];
    let valueB = b[key];

    if (sortType === "number") {
      // Convert numeric strings to numbers before sorting
      valueA =
        typeof valueA === "string" && !isNaN(Number(valueA))
          ? Number(valueA)
          : valueA;
      valueB =
        typeof valueB === "string" && !isNaN(Number(valueB))
          ? Number(valueB)
          : valueB;

      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }
    } else {
      // String sorting (default behavior)
      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB, undefined, { numeric: true })
          : valueB.localeCompare(valueA, undefined, { numeric: true });
      }
    }

    return 0; // If types are mixed, no sorting happens
  });
};

export function toSentenceCase(str) {
  if (!str || typeof str !== "string") {
    return "";
  }

  // Trim any leading or trailing whitespace
  str = str.trim();

  // Split the string into words, capitalize each, and join them back together
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const isProductionCheck = (function () {
  if (window.location.href.includes("https://staging.schoolmateglobal.com")) {
    return true; // Update with your development API URL
  } else if (
    window.location.href.includes("https://portal.schoolmateglobal.com")
  ) {
    return true;
  } else if (window.location.href.includes("https://schoolmates.vercel.app/")) {
    return true;
  } else {
    return false;
  }
})();

// export const backendAPI = backendUrl();

export const homeUrl = {
  Superadmin: "/app/super-admin",
  Teacher: "/app/teachers",
  Principal: "/app/principal",
  Student: "/app/student-home",
  Admin: "/app/admin",
  Account: "/app/account-home",
};

export const dashboardSideBarLinks = {
  Admin: [
    {
      to: "/app/admin",
      title: "Home",
      icon: faHome,
    },
    {
      to: "/app/calendar",
      title: "Calendar",
      icon: faCalendarDays,
    },
    {
      to: "/app/communication-book",
      title: "Communication Book",
      icon: faEnvelopeOpenText,
    },
    {
      to: "/app/results",
      title: "Results",
      icon: faBuildingColumns,
    },
    {
      to: "/app/timetable",
      title: "Timetable",
      icon: faTimeline,
    },
    {
      to: "/app/classes",
      title: "Classes",
      icon: faSchool,
    },
    {
      to: "/app/pre-school",
      title: "Pre School",
      icon: faChildren,
    },
    {
      to: "/app/departments",
      title: "Departments",
      icon: faBuilding,
    },
    {
      to: "/app/grading",
      title: "Grading",
      icon: faMarker,
    },
    {
      to: "/app/grade-point",
      title: "Grade Point",
      icon: faChartArea,
    },

    {
      to: "/app/resumption-date",
      title: "Resumption Date",
      icon: faSchoolLock,
    },
    {
      to: "/app/skills",
      title: "Skills",
      icon: faBalanceScale,
    },
    {
      to: "/app/reporting",
      title: "Reports",
      icon: faReceipt,
    },
    {
      to: "/app/staffs",
      title: "Staffs",
      icon: faClipboardUser,
    },
    {
      to: "/app/lesson-note",
      title: "Lesson Note",
      icon: faBookBookmark,
    },
    {
      to: "/app/flip-class",
      title: "Flip Class",
      icon: faChalkboardUser,
    },
    {
      to: "/app/students",
      title: "Students",
      icon: faGraduationCap,
    },
    {
      to: "/app/subjects",
      title: "Subjects",
      icon: faBookmark,
    },
    {
      to: "/app/activities",
      title: "Extra Curricular",
      icon: faPersonSwimming,
    },
    {
      to: "/app/activities2",
      title: "Extra_Curricular",
      icon: faPersonSwimming,
    },
    {
      to: "/app/vehicles",
      title: "Vehicles",
      icon: faTruck,
    },
    {
      to: "/app/vehicle-logs",
      title: "Vehicle Logs",
      icon: faBusSimple,
    },
  ],
  Superadmin: [
    {
      to: "/app/super-admin",
      title: "Home",
      icon: faHome,
    },

    {
      to: "/app/campus",
      title: "Campus",
      icon: faBuildingColumns,
    },
    {
      to: "/app/classes",
      title: "Classes",
      icon: faSchool,
    },

    {
      to: "/app/departments",
      title: "Departments",
      icon: faBuilding,
    },

    {
      to: "/app/reports",
      title: "Report",
      icon: faFileInvoice,
    },
    {
      to: "/app/staffs",
      title: "Staffs",
      icon: faClipboardUser,
    },
    {
      to: "/app/students",
      title: "Students",
      icon: faGraduationCap,
    },
    {
      to: "/app/vehicles",
      title: "Vehicles",
      icon: faTruck,
    },
    {
      to: "/app/vendors",
      title: "Vendors",
      icon: faPaperPlane,
    },
  ],
  Teacher: [
    {
      to: "/app/teachers",
      title: "Home",
      icon: faHome,
    },
    {
      to: "/app/attendance",
      title: "Attendance",
      icon: faPeopleGroup,
    },
    {
      to: "/app/communication-book",
      title: "Communication Book",
      icon: faEnvelopeOpenText,
    },
    {
      to: "/app/results",
      title: "Results",
      icon: faSquarePollVertical,
      // icon: faBuildingColumns,
    },
    {
      to: "/app/broadsheet",
      title: "Broad Sheet",
      icon: faSquarePollHorizontal,
    },
    {
      to: "/app/lesson-note",
      title: "Lesson Note",
      icon: faBookBookmark,
    },
    {
      to: "/app/flip-class",
      title: "Flip Class",
      icon: faChalkboardUser,
    },
    {
      to: "/app/students",
      title: "Students",
      icon: faGraduationCap,
    },
    {
      to: "/app/assignments",
      title: "Assignments",
      icon: faBook,
    },
    {
      to: "/app/cbt",
      title: "CBT",
      icon: faDesktop,
    },
  ],
  Principal: [
    {
      to: "/app/principal",
      title: "Home",
      icon: faHome,
    },
    {
      to: "/app/comment",
      title: "Comment",
      icon: faComment,
    },
    {
      to: "/app/communication-book",
      title: "Communication Book",
      icon: faEnvelopeOpenText,
    },
    {
      to: "/app/results",
      title: "Results",
      icon: faBuildingColumns,
    },
    {
      to: "/app/broadsheet",
      title: "Broad Sheet",
      icon: faSquarePollHorizontal,
    },
    {
      to: "/app/lesson-note",
      title: "Lesson Note",
      icon: faBookBookmark,
    },
    {
      to: "/app/staffs",
      title: "Staffs",
      icon: faClipboardUser,
    },
    {
      to: "/app/students",
      title: "Students",
      icon: faGraduationCap,
    },
  ],
  Student: [
    {
      to: "/app/student-home",
      title: "Home",
      icon: faHome,
    },
    {
      to: "/app/accounts",
      title: "Finance",
      icon: faSchool,
    },
    {
      to: "/app/communication-book",
      title: "Communication Book",
      icon: faEnvelopeOpenText,
    },
    {
      to: "/app/results",
      title: "Results",
      icon: faBuildingColumns,
    },
    {
      to: "/app/assignments",
      title: "Assignments",
      icon: faBook,
    },
    {
      to: "/app/cbt",
      title: "CBT",
      icon: faDesktop,
    },
    // {
    //   to: "/app/students",
    //   title: "Students",
    //   icon: faGraduationCap,
    // },
    {
      to: "/app/flip-class",
      title: "Flip Class",
      icon: faChalkboardUser,
    },
    {
      to: "/app/vehicles",
      title: "School Bus",
      icon: faTruck,
    },
  ],
  Account: [
    {
      to: "/app/account-home",
      title: "Home",
      icon: faHome,
    },
    {
      to: "/app/expense",
      title: "Expenses",
      icon: faShoppingBasket,
    },
    {
      to: "/app/reports",
      title: "Report",
      icon: faMoneyBill,
    },
    {
      to: "/app/vendors",
      title: "Vendors",
      icon: faAddressCard,
    },
    {
      to: "/app/transfer",
      title: "Transfer Funds",
      icon: faMoneyBill,
    },
    {
      to: "/app/chart-account",
      title: "Chart Account",
      icon: faChartSimple,
    },
    {
      to: "/app/fee-list",
      title: "Fees",
      icon: faScaleBalanced,
    },

    {
      to: "/app/payment",
      title: "Payment",
      icon: faMoneyBill,
    },
    {
      to: "/app/bank",
      title: "Bank",
      icon: faBuildingColumns,
    },
    {
      to: "/app/invoice",
      title: "Invoice",
      icon: faEnvelope,
    },
    {
      to: "/app/students",
      title: "Students",
      icon: faGraduationCap,
    },
    {
      to: "/app/vehicles",
      title: "Vehicles",
      icon: faTruck,
    },
    {
      to: "/app/vehicle-maintenance",
      title: "Vehicle Maintenance",
      icon: faBusSimple,
    },
  ],
};

export const countryList = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas (the)",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia (Plurinational State of)",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory (the)",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cayman Islands (the)",
  "Central African Republic (the)",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands (the)",
  "Colombia",
  "Comoros (the)",
  "Congo (the Democratic Republic of the)",
  "Congo (the)",
  "Cook Islands (the)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czechia",
  "Côte d'Ivoire",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic (the)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Falkland Islands (the) [Malvinas]",
  "Faroe Islands (the)",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories (the)",
  "Gabon",
  "Gambia (the)",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and McDonald Islands",
  "Holy See (the)",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran (Islamic Republic of)",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea (the Democratic People's Republic of)",
  "Korea (the Republic of)",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic (the)",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands (the)",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia (Federated States of)",
  "Moldova (the Republic of)",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands (the)",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger (the)",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands (the)",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine, State of",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines (the)",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Republic of North Macedonia",
  "Romania",
  "Russian Federation (the)",
  "Rwanda",
  "Réunion",
  "Saint Barthélemy",
  "Saint Helena, Ascension and Tristan da Cunha",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin (French part)",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten (Dutch part)",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan (the)",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands (the)",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates (the)",
  "United Kingdom of Great Britain and Northern Ireland (the)",
  "United States Minor Outlying Islands (the)",
  "United States of America (the)",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela (Bolivarian Republic of)",
  "Viet Nam",
  "Virgin Islands (British)",
  "Virgin Islands (U.S.)",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
  "Åland Islands",
];

export const countryListSelect = countryList.map((x) => ({
  title: x,
  value: x,
}));

export const roleMap = {
  Admin: "Admin",
  Superadmin: "Super Admin",
  Account: "Account",
  Principal: "Principal",
  Teacher: "Teacher",
  Student: "Student",
};

export const colors = {
  primary: "#01153b",
  secondary: "#367fa9",
  black: "#000",
  white: "#ffffff",
};

export function sortByAcademicSession(array) {
  return array.sort((a, b) => {
    const [startYearA, endYearA] = a.academic_session.split("/").map(Number);
    const [startYearB, endYearB] = b.academic_session.split("/").map(Number);

    // Compare start years first, if equal, compare end years
    if (startYearA === startYearB) {
      return endYearA - endYearB;
    }
    return startYearA - startYearB;
  });
}

import { faClose, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
} from "reactstrap";
import Hamburger from "../components/common/hamburger";
import ProfileImage from "../components/common/profile-image";
import { useAppContext } from "../hooks/useAppContext";
import { dashboardSideBarLinks } from "../utils/constants";
import { useCommunicationBook } from "../hooks/useCommunicationBook";
import { useQuery } from "react-query";
import queryKeys from "../utils/queryKeys";
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const [dropdown, setDropdown] = useState(false);

  const {
    isOpen: navbarIsOpen,
    toggle: toggleNavbar,
    closeSidebar,
    user,
    logout,
    cbtPlaying,
    hideAllBars,
    setHideAllBars,
  } = useAppContext();
  const sidebarRef = useRef(null);

  const navigate = useNavigate();

  const { permission, apiServices, user: newUser } = useCommunicationBook();

  // GET COMMUNICATION BOOK COUNTS /////////
  const {
    isLoading: getUnreadCommunicationBookCountLoading,
    data: getUnreadCommunicationBookCount,
    isFetching: getUnreadCommunicationBookCountFetching,
    isRefetching: getUnreadCommunicationBookCountRefetching,
    refetch: refetchGetUnreadCommunicationBookCount,
  } = useQuery(
    [queryKeys.GET_COMMUNICATION_BOOK_COUNT],
    () => apiServices.getUnreadCommunicationBookCount(),
    {
      retry: 2,
      // enabled: !!id && permission?.view,

      select: (data) => {
        console.log({ datarr: data, dtr: data?.data });

        return data?.data || 0;

        // if (data?.data?.length > 0) {
        //   const ddt = data?.data?.map((dt, i) => {
        //     const type = designation(dt?.sender?.designation);
        //     return {
        //       communication_id: dt?.communication_book_id,
        //       reply_id: dt?.id,
        //       sender_id: dt?.sender_id,
        //       sender_type: type,
        //       sender_email: dt?.sender?.email,
        //       sender: `${dt?.sender?.first_name} ${dt?.sender?.last_name} (${type})`,
        //       message: dt?.message,
        //       date: dayjs(dt?.date, "D MMM YYYY h:mm A").format(
        //         "dddd MMMM D, YYYY h:mm A"
        //       ),
        //     };
        //   });

        // console.log({ ddt });

        //   return ddt;
        // } else {
        //   return [];
        // }

        // return permission?.create ? filt : lsg;
      },

      onSuccess(data) {
        // setReplyMessages(data);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !sidebarRef?.current?.contains(event.target) &&
        document.body.getBoundingClientRect().width < 900
      ) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterSideBarOnPlan = () => {
    switch (user?.plan) {
      case "STARTER PLAN":
        return dashboardSideBarLinks[user?.designation_name]?.filter(
          (ps) =>
            ps.title !== "Lesson Note" &&
            ps.title !== "Report" &&
            ps.title !== "Vehicle Logs" &&
            ps.title !== "Vehicles" &&
            ps.title !== "Communication Book"
        );
        break;

      case "STANDARD PLAN":
        return dashboardSideBarLinks[user?.designation_name];
        break;

      case "PREMIUM PLAN":
        return dashboardSideBarLinks[user?.designation_name];
        break;

      case "ENTERPRISE PLAN":
        return dashboardSideBarLinks[user?.designation_name];
        break;

      default:
        break;
    }
  };

  const filterOutPreschoolMenu = () => {
    // if(user?.plan === "STARTER PLAN"){

    // }

    if (user?.is_preschool === "true") {
      // return dashboardSideBarLinks[user?.designation_name];
      return filterSideBarOnPlan()?.filter(
        (ps) =>
          ps.title !== "Classes" &&
          ps.title !== "Extra Curricular" &&
          ps.title !== "Broad Sheet"
      );
    } else if (user?.is_preschool === "false") {
      return filterSideBarOnPlan()?.filter(
        (ps) => ps.title !== "Pre School" && ps.title !== "Extra_Curricular"
      );
    }
  };

  console.log({ user, filterSideBarOnPlan: filterSideBarOnPlan() });

  return (
    <div className='dashboard-layout-wrapper'>
      <div
        ref={sidebarRef}
        className={`sidebar-wrapper ${navbarIsOpen ? "toggle-navbar" : ""}`}
        style={{
          display: `${hideAllBars ? "none" : ""}`,
        }}
      >
        <div className='d-flex justify-content-end p-3 close-nav-button-wrapper'>
          <button
            type='button'
            className='btn text-white'
            onClick={toggleNavbar}
          >
            <FontAwesomeIcon icon={faClose} className='me-2' /> Close
          </button>
        </div>
        <div className='sidebar-top-wrapper'>
          <ProfileImage
            wrapperClassName='school-image'
            src={user?.school?.schlogo}
          />
          <p title={user?.school?.schname}>{user?.school?.schname}</p>
        </div>
        <div className='sidebar-links-wrapper'>
          {filterOutPreschoolMenu()?.map((item, i) => {
            if (user?.is_preschool) {
            }
            return (
              <NavLink key={i} to={item?.to}>
                <FontAwesomeIcon icon={item?.icon} />
                <p>{item.title}</p>
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className='content-wrapper'>
        {!hideAllBars && (
          <Navbar
            style={{ zIndex: "999" }}
            color='light'
            expand='md'
            className='px-4 py-3 shadow'
            light
          >
            <Nav className='align-items-center'>
              <Hamburger onClick={toggleNavbar} />
              <div className='d-flex gap-3 align-items-center'>
                <p className='ms-3'>Welcome {user?.firstname}</p>
                {
                  <div
                    style={{ position: "relative", cursor: "pointer" }}
                    onClick={() => {
                      if (getUnreadCommunicationBookCount > 0) {
                        navigate("/app/communication-book");
                      } else {
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faBell}
                      style={{ fontSize: "20px" }}
                    />
                    {getUnreadCommunicationBookCount > 0 && (
                      <div
                        className='d-flex justify-content-center align-items-center '
                        style={{
                          background: "green",
                          height: "20px",
                          width: "20px",
                          border: "1px solid #96ff9a",
                          borderRadius: "50%",
                          padding: "10px",
                          position: "absolute",
                          top: "-10px",
                          left: "10px",
                        }}
                      >
                        <p
                          className='fw-bold text-white'
                          style={{ fontSize: "10px" }}
                        >
                          {getUnreadCommunicationBookCount}
                        </p>
                      </div>
                    )}
                  </div>
                }
              </div>
            </Nav>
            <Nav className='ms-auto' navbar>
              <Dropdown isOpen={dropdown} toggle={() => setDropdown(!dropdown)}>
                <DropdownToggle tag='div'>
                  <ProfileImage src={user.image} />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    <Link
                      className='py-3 nav-dropdown-link'
                      to='/app/change-password'
                    >
                      Change Password
                    </Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link className='py-3 nav-dropdown-link' to='/app/profile'>
                      My Profile
                    </Link>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem className='py-3' onClick={logout}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Nav>
          </Navbar>
        )}
        <div className='content-inner-wrapper'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

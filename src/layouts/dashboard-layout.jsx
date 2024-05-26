import { faClose } from "@fortawesome/free-solid-svg-icons";
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
        return dashboardSideBarLinks[user?.designation_name].filter(
          (ps) =>
            ps.title !== "Lesson Note" &&
            ps.title !== "Report" &&
            ps.title !== "Vehicle Logs" &&
            ps.title !== "Vehicles"
        );
        break;

      case "STANDARD PLAN":
        return dashboardSideBarLinks[user?.designation_name].filter(
          (ps) =>
            ps.title !== "Lesson Note"
            // ps.title !== "Report" &&
            // ps.title !== "Vehicle Logs" &&
            // ps.title !== "Vehicles"
        );
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
      return filterSideBarOnPlan().filter(
        (ps) => ps.title !== "Pre School" && ps.title !== "Extra_Curricular"
      );
    }
  };

  // console.log({ user, filterSideBarOnPlan: filterSideBarOnPlan() });

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
              <p className='ms-3'>Welcome {user?.firstname}</p>
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

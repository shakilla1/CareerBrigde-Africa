import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaBriefcase,
  FaFileAlt,
  FaBookmark,
  FaBookOpen,
  FaUser,
  FaCog,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Browse Opportunities",
      path: "/student/opportunities",
      icon: <FaBriefcase />,
    },
    {
      name: "Applications",
      path: "/student/applications",
      icon: <FaFileAlt />,
    },
    {
      name: "Saved Opportunities",
      path: "/student/saved",
      icon: <FaBookmark />,
    },
    {
      name: "Mentorship",
      path: "/student/mentorship",
      icon: <FaBookOpen />,
    },
    {
      name: "My Profile",
      path: "/student/profile",
      icon: <FaUser />,
    },
    {
      name: "Settings",
      path: "/student/settings",
      icon: <FaCog />,
    },
  ];

  return (
  <aside className="sidebar">

    <div className="sidebar__logo">
      <span className="logo-main">CareerBridge</span>
      <span className="logo-sub">Africa</span>
    </div>

    <nav>
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            isActive ? "sidebar__link active" : "sidebar__link"
          }
        >
          <span>{item.icon}</span>
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>

  </aside>
);
}

export default Sidebar;
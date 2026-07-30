import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaPlusCircle,
  FaBriefcase,
  FaUsers,
  FaUser,
  FaCog,
} from "react-icons/fa";

import "./EmployerSidebar.css";

function EmployerSidebar() {

  const menuItems = [
    {
      name: "Dashboard",
      path: "/employer/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Post Opportunity",
      path: "/employer/post-opportunity",
      icon: <FaPlusCircle />,
    },
    {
      name: "Manage Opportunities",
      path: "/employer/manage-opportunities",
      icon: <FaBriefcase />,
    },
    {
      name: "Applicants",
      path: "/employer/applicants",
      icon: <FaUsers />,
    },
    {
      name: "Profile",
      path: "/employer/profile",
      icon: <FaUser />,
    },
    {
      name: "Settings",
      path: "/employer/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <aside className="employer-sidebar">

      <h2 className="employer-sidebar__logo">
        CareerBridge
      </h2>

      <nav>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "employer-sidebar__link active"
                : "employer-sidebar__link"
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

export default EmployerSidebar;
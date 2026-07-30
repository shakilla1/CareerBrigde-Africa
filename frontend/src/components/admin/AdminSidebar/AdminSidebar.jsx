import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaUserCheck,
  FaUsers,
  FaBookOpen,
  FaFlag,
  FaUser,
  FaCog,
} from "react-icons/fa";

import "./AdminSidebar.css";

function AdminSidebar() {

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Employer Verification",
      path: "/admin/employer-verification",
      icon: <FaUserCheck />,
    },
    {
      name: "User Management",
      path: "/admin/user-management",
      icon: <FaUsers />,
    },
    {
      name: "Mentorship",
      path: "/admin/mentorship",
      icon: <FaBookOpen />,
    },
    {
      name: "Reported Items",
      path: "/admin/reported-items",
      icon: <FaFlag />,
    },
    {
      name: "Profile",
      path: "/admin/profile",
      icon: <FaUser />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <aside className="admin-sidebar">

      <h2 className="admin-sidebar__logo">
        CareerBridge
      </h2>

      <nav>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "admin-sidebar__link active"
                : "admin-sidebar__link"
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

export default AdminSidebar;
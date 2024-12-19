import React, { useState } from "react";
import "./Sidebar.css"; // Custom CSS (optional)

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Menus");

  const menuItems = [
    {
      name: "Systems",
      icon: "📁",
      subItems: ["System Code", "Properties", "Menus", "API List"],
    },
    { name: "Users & Group", icon: "👤" },
    { name: "Competition", icon: "🏆" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        CLO<span>IT</span>
      </div>
      <ul className="menu">
        {menuItems.map((item) => (
          <li key={item.name} className="menu-item">
            <div>
              <span className="icon">{item.icon}</span>
              <span>{item.name}</span>
            </div>

            {/* Submenu */}
            {item.subItems && (
              <ul className="submenu">
                {item.subItems.map((sub) => (
                  <li
                    key={sub}
                    className={`submenu-item ${
                      activeItem === sub ? "active" : ""
                    }`}
                    onClick={() => setActiveItem(sub)}
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

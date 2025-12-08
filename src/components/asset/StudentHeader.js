"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, Dropdown, Breadcrumb, Button } from "antd";
import { LogOut, User, Settings, Home, Menu } from "lucide-react";

const StudentHeader = ({ onMenuClick, isMobile = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Read data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserInfo(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Function to convert pathname to page title
  const getPageTitle = () => {
    const pageMap = {
      "/student/home": "Home",
      "/student/participation": "My Activities",
      "/student/submit-event": "Submit Activity",
      "/student/report": "Report",
      "/student/profile": "Profile",
      "/student/settings": "Settings",
    };
    return pageMap[pathname] || "Dashboard";
  };

  // Create breadcrumb items
  const getBreadcrumbItems = () => {
    const pathArray = pathname.split("/").filter((item) => item);
    const items = [
      {
        title: (
          <span className="flex items-center gap-1">
            <Home size={14} />
            Student
          </span>
        ),
      },
    ];

    if (pathArray.length > 1) {
      const pageMap = {
        home: "Home",
        participation: "My Activities",
        "submit-event": "Submit Activity",
        report: "Report",
        profile: "Profile",
        settings: "Settings",
      };

      items.push({
        title: pageMap[pathArray[1]] || pathArray[1],
      });
    }

    return items;
  };

  const handleLogout = () => {
    // Remove data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    {
      key: "profile",
      icon: <User size={16} />,
      label: "Profile",
      onClick: () => router.push("/student/profile"),
    },
    // {
    //   key: "settings",
    //   icon: <Settings size={16} />,
    //   label: "Settings",
    //   onClick: () => router.push("/student/settings"),
    // },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut size={16} />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 w-full">
      <div className={isMobile ? "px-3 py-2" : "px-6 py-3"}>
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button + Page Title */}
          <div className="flex items-center gap-3">
            {isMobile && onMenuClick && (
              <Button
                type="text"
                icon={<Menu size={20} />}
                onClick={onMenuClick}
                className="flex items-center justify-center"
              />
            )}
            <div>
              <h1
                className={
                  isMobile
                    ? "text-base font-semibold text-gray-800"
                    : "text-lg font-semibold text-gray-800"
                }
              >
                {getPageTitle()}
              </h1>
              {!isMobile && (
                <Breadcrumb
                  items={getBreadcrumbItems()}
                  separator="/"
                  className="text-xs"
                />
              )}
            </div>
          </div>

          {/* User Profile */}
          {userInfo && (
            <Dropdown
              menu={{ items: menuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div
                className={
                  isMobile
                    ? "flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
                    : "flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                }
              >
                {!isMobile && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {userInfo.name || "Student"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userInfo.studentId || "Student"}
                    </p>
                  </div>
                )}
                <Avatar
                  size={isMobile ? 32 : 40}
                  style={{
                    backgroundColor: "#0A894C",
                    color: "#fff",
                  }}
                >
                  {userInfo.name?.charAt(0) || "S"}
                </Avatar>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;

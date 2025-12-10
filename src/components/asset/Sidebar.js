"use client";

import { useState } from "react";
import { Layout, Menu } from "antd";
import {
  Home,
  CalendarCheck,
  Send,
  FileText,
  Calendar,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const { Sider } = Layout;

// เมนูสำหรับนักเรียน
const studentMenuItems = [
  {
    key: "/student/home",
    icon: <Home size={20} />,
    label: "หน้าหลัก",
  },
  {
    key: "/student/participation",
    icon: <CalendarCheck size={20} />,
    label: "กิจกรรม",
  },
  // {
  //   key: "/student/submit-event",
  //   icon: <Send size={20} />,
  //   label: "ส่งกิจกรรม",
  // },
  // {
  //   key: "/student/report",
  //   icon: <FileText size={20} />,
  //   label: "รายงาน",
  // },
];

// เมนูสำหรับครู
const teacherMenuItems = [
  {
    key: "/teacher/home",
    icon: <Home size={20} />,
    label: "หน้าหลัก",
  },
  {
    key: "/teacher/participation",
    icon: <CalendarCheck size={20} />,
    label: "เข้าร่วมกิจกรรม",
  },
  {
    key: "/teacher/event",
    icon: <Calendar size={20} />,
    label: "กิจกรรม",
  },
  {
    key: "/teacher/report",
    icon: <FileText size={20} />,
    label: "รายงาน",
  },
];

// เมนูสำหรับแอดมิน
const adminMenuItems = [
  {
    key: "/admin/home",
    icon: <Home size={20} />,
    label: "หน้าหลัก",
  },
  {
    key: "/admin/participation",
    icon: <CalendarCheck size={20} />,
    label: "เข้าร่วมกิจกรรม",
  },
  {
    key: "/admin/event",
    icon: <Calendar size={20} />,
    label: "กิจกรรม",
  },
  {
    key: "/admin/user",
    icon: <Users size={20} />,
    label: "บุคลากร",
  },
  {
    key: "/admin/report",
    icon: <FileText size={20} />,
    label: "รายงาน",
  },
];

const Sidebar = ({ userRole = "student", collapsed = false, onCollapse }) => {
  const pathname = usePathname();
  const router = useRouter();

  // เลือกเมนูตาม role
  const getMenuItems = () => {
    switch (userRole) {
      case "student":
        return studentMenuItems;
      case "teacher":
        return teacherMenuItems;
      case "admin":
        return adminMenuItems;
      default:
        return studentMenuItems;
    }
  };

  const handleMenuClick = ({ key }) => {
    router.push(key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="light"
      width={250}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        background: "#ffffff",
        boxShadow: "2px 0 8px rgba(0,0,0,0.08)",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          height: 120,
          margin: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/Logo.png"
          alt="TAS Logo"
          width={collapsed ? 60 : 120}
          height={collapsed ? 60 : 120}
          priority
          className="object-contain"
        />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={getMenuItems()}
        onClick={handleMenuClick}
        style={{
          borderRight: 0,
          background: "transparent",
          color: "#0A894C",
        }}
        theme="light"
        className="custom-sidebar-menu"
      />
      <style jsx global>{`
        .custom-sidebar-menu .ant-menu-item {
          color: #0a894c !important;
          margin: 4px 8px !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        }

        .custom-sidebar-menu .ant-menu-item:hover {
          background: rgba(10, 137, 76, 0.08) !important;
          color: #0a894c !important;
        }

        .custom-sidebar-menu .ant-menu-item-selected {
          background: rgba(10, 137, 76, 0.12) !important;
          color: #0a894c !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 8px rgba(10, 137, 76, 0.15) !important;
        }

        .custom-sidebar-menu .ant-menu-item-selected::after {
          display: none !important;
        }

        .ant-layout-sider-trigger {
          background: #f8f9fa !important;
          color: #0a894c !important;
          border-top: 1px solid #e8e8e8 !important;
        }

        .ant-layout-sider-trigger:hover {
          background: rgba(10, 137, 76, 0.08) !important;
        }
      `}</style>
    </Sider>
  );
};

export default Sidebar;

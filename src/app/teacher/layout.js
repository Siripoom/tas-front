"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "antd";
import Sidebar from "@/components/asset/Sidebar";
import TeacherHeader from "@/components/asset/TeacherHeader";
import "../globals.css";

const { Content } = Layout;

export default function TeacherLayout({ children }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // เช็คการ login และ role จาก localStorage
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      // เช็คว่ามีทั้ง user และ token หรือไม่
      if (!storedUser || !token) {
        // ถ้าไม่มีข้อมูล login ให้ redirect ไปหน้า login
        router.push("/login");
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        console.log("User Data:", userData);

        // เช็คว่า role เป็น teacher หรือไม่
        if (userData.role === "teacher") {
          // ถ้าไม่ใช่ teacher ให้ redirect ไปหน้า login
          alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
          localStorage.clear(); // ลบข้อมูลทั้งหมด
          router.push("/login");
          return;
        }

        // ถ้าทุกอย่างผ่าน
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.clear(); // ลบข้อมูลที่เสียหาย
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // แสดง loading ขณะเช็คการ login
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A894C]"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // ถ้ายังไม่ได้ authenticated ไม่แสดงอะไร (จะ redirect แล้ว)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        userRole="teacher"
        collapsed={collapsed}
        onCollapse={setCollapsed}
      />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
          transition: "margin-left 0.2s",
        }}
      >
        <TeacherHeader />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "calc(100vh - 112px)",
            background: "#f5f5f5",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

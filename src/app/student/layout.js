"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout, Drawer } from "antd";
import Sidebar from "@/components/asset/Sidebar";
import StudentHeader from "@/components/asset/StudentHeader";
import "../globals.css";

const { Content } = Layout;

export default function StudentLayout({ children }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check login and role from localStorage
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      // เช็คว่ามีทั้ง user และ token หรือไม่
      if (!storedUser || !token) {
        // If no login data, redirect to login page
        router.push("/login");
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        console.log("User Data:", userData);

        // Check if role is student
        if (userData.userType !== "student") {
          // If not student, redirect to login page
          alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
          localStorage.clear(); // ลบข้อมูลทั้งหมด
          router.push("/login");
          return;
        }

        // If everything passes
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

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show loading while checking login
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A894C]"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't show anything (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          userRole="student"
          collapsed={collapsed}
          onCollapse={setCollapsed}
        />
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          closable={false}
          styles={{ body: { padding: 0 }, wrapper: { width: 250 } }}
        >
          <Sidebar
            userRole="student"
            collapsed={false}
            onCollapse={() => {}}
          />
        </Drawer>
      )}

      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 250,
          transition: "margin-left 0.2s",
        }}
      >
        <StudentHeader
          onMenuClick={() => setMobileDrawerOpen(true)}
          isMobile={isMobile}
        />
        <Content
          style={{
            margin: isMobile ? "16px 8px" : "24px 16px",
            padding: isMobile ? 16 : 24,
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

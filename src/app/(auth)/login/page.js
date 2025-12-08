"use client";

import { useState } from "react";
import { Form, Input, Card, message } from "antd";
import { Mail, Lock, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/asset/CustomButton";
import { login } from "../../../services/auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await login(values.email, values.password);

      // Store token
      localStorage.setItem("token", data.token);

      // Store user data in localStorage from response
      const userData = {
        id: data.user.id,
        studentId: data.user.studentId,
        fullname: data.user.fullname,
        email: data.user.email,
        phone: data.user.phone,
        departmentId: data.user.departmentId,
        departmentName: data.user.department?.name || "",
        majorId: data.user.majorId,
        userType: data.user.userType,
        birthday: data.user.birthday,
        level: data.user.level,
        profilePic: data.user.profilePic,
        status: data.user.status
      };
      localStorage.setItem("user", JSON.stringify(userData));

      message.success("เข้าสู่ระบบสำเร็จ");

      if (userData.userType === "student") {
        router.push("/student/home");
      } else if (userData.userType === "teacher") {
        router.push("/teacher/home");
      } else if (userData.userType === "admin") {
        router.push("/admin/home");
      }
    } catch (error) {
      message.error("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#3D5753" }}
    >
      <Card
        className="w-full max-w-md shadow-2xl rounded-2xl border-0"
        bodyStyle={{ padding: "48px 40px" }}
      >
        <div className="text-center mb-6">
          <div className="flex justify-center ">
            <Image
              src="/Logo.png"
              alt="TAS Logo"
              width={200}
              height={200}
              priority
              className="object-contain"
            />
          </div>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="email"
            label={
              <span className="text-gray-700 font-medium">รหัสนักศึกษา</span>
            }
            rules={[
              {
                required: true,
                message: "กรุณากรอกรหัสนักศึกษา",
              },
            ]}
          >
            <Input
              prefix={<Mail size={18} className="text-gray-400" />}
              placeholder="example@email.com"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-gray-700 font-medium">รหัสผ่าน</span>}
            rules={[
              {
                required: true,
                message: "กรุณากรอกรหัสผ่าน",
              },
            ]}
          >
            <Input.Password
              prefix={<Lock size={18} className="text-gray-400" />}
              placeholder="••••••••"
              className="rounded-lg"
            />
          </Form.Item>

          <div className="text-right mb-6">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              ลืมรหัสผ่าน?
            </a>
          </div>

          <Form.Item className="mb-0">
            <CustomButton
              htmlType="submit"
              loading={loading}
              block
              icon={<LogIn size={20} />}
              backgroundColor="#2D2D2D"
              height="3rem"
              fontSize="1rem"
              fontWeight="500"
              shadow="lg"
            >
              เข้าสู่ระบบ
            </CustomButton>
          </Form.Item>
        </Form>
      </Card>

      <style jsx global>{`
        .ant-input-affix-wrapper {
          border-radius: 0.5rem !important;
        }
        .ant-input-password {
          border-radius: 0.5rem !important;
        }
      `}</style>
    </div>
  );
}

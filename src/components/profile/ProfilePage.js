"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Avatar, Button, Form, Input, message, Divider } from "antd";
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Building, Lock, Key } from "lucide-react";

export default function ProfilePage({ userRole }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Read user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserInfo(userData);
        form.setFieldsValue(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [form]);

  const handleSave = (values) => {
    try {
      // Handle password change if provided
      if (values.currentPassword || values.newPassword || values.confirmPassword) {
        // Check if current password matches
        if (values.currentPassword !== userInfo.password) {
          message.error("Current password is incorrect");
          return;
        }

        // Check if new password and confirm password match
        if (values.newPassword !== values.confirmPassword) {
          message.error("New passwords do not match");
          return;
        }

        // Update password
        const updatedUser = {
          ...userInfo,
          ...values,
          password: values.newPassword
        };

        // Remove password fields from the stored object
        delete updatedUser.currentPassword;
        delete updatedUser.confirmPassword;
        delete updatedUser.newPassword;

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserInfo(updatedUser);
        setIsEditing(false);
        form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
        message.success("Profile and password updated successfully");
      } else {
        // Normal profile update without password change
        const updatedUser = { ...userInfo, ...values };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserInfo(updatedUser);
        setIsEditing(false);
        message.success("Profile updated successfully");
      }
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    form.setFieldsValue(userInfo);
    form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
    setIsEditing(false);
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "admin":
        return "#3D5753";
      case "teacher":
        return "#0A894C";
      case "student":
        return "#0A894C";
      default:
        return "#3D5753";
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case "admin":
        return "Administrator";
      case "teacher":
        return "Teacher";
      case "student":
        return "Student";
      default:
        return "User";
    }
  };

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A894C]"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Banner */}
      <Card
        className="mb-6 md:mb-8 shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${getRoleColor()} 0%, ${getRoleColor()}dd 100%)`,
          border: "none",
        }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
            <Avatar
              size={window.innerWidth < 768 ? 80 : 100}
              style={{
                backgroundColor: "#ffffff",
                color: getRoleColor(),
                fontSize: window.innerWidth < 768 ? "2rem" : "2.5rem",
                fontWeight: "bold",
              }}
            >
              {userInfo.name?.charAt(0) || "U"}
            </Avatar>
            <div className="text-white text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-1">{userInfo.name}</h2>
              <p className="text-base md:text-lg opacity-90">{getRoleLabel()}</p>
              {userRole === "teacher" && userInfo.department && (
                <p className="text-xs md:text-sm opacity-80 mt-1">{userInfo.department}</p>
              )}
              {userRole === "student" && userInfo.studentId && (
                <p className="text-xs md:text-sm opacity-80 mt-1">ID: {userInfo.studentId}</p>
              )}
            </div>
          </div>
          <div className="w-full md:w-auto">
            {!isEditing ? (
              <Button
                icon={<Edit size={18} />}
                size="large"
                onClick={() => setIsEditing(true)}
                style={{
                  backgroundColor: "#ffffff",
                  color: getRoleColor(),
                  borderColor: "#ffffff",
                  width: window.innerWidth < 768 ? "100%" : "auto",
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  icon={<Save size={18} />}
                  type="primary"
                  size="large"
                  onClick={() => form.submit()}
                  style={{
                    backgroundColor: "#ffffff",
                    color: getRoleColor(),
                    borderColor: "#ffffff",
                    flex: window.innerWidth < 768 ? 1 : "none",
                  }}
                >
                  Save
                </Button>
                <Button
                  icon={<X size={18} />}
                  size="large"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "transparent",
                    color: "#ffffff",
                    borderColor: "#ffffff",
                    flex: window.innerWidth < 768 ? 1 : "none",
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Profile Information */}
      <Form
        form={form}
        onFinish={handleSave}
        layout="vertical"
      >
        <Row gutter={[16, 16]}>
          {/* Personal Information */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <User size={18} style={{ color: getRoleColor() }} />
                  <span className="text-base md:text-lg">Personal Information</span>
                </div>
              }
              style={{ borderRadius: 12, height: "100%" }}
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  size="large"
                  prefix={<User size={16} />}
                  disabled={!isEditing}
                  placeholder="Enter full name"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<Mail size={16} />}
                  disabled={!isEditing}
                  placeholder="Enter email address"
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
              >
                <Input
                  size="large"
                  prefix={<Phone size={16} />}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                />
              </Form.Item>

              {userRole === "student" && (
                <Form.Item
                  label="Student ID"
                  name="studentId"
                >
                  <Input
                    size="large"
                    prefix={<User size={16} />}
                    disabled={!isEditing}
                    placeholder="Enter student ID"
                  />
                </Form.Item>
              )}
            </Card>
          </Col>

          {/* Additional Information */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <Building size={18} style={{ color: getRoleColor() }} />
                  <span className="text-base md:text-lg">Additional Information</span>
                </div>
              }
              style={{ borderRadius: 12, height: "100%" }}
            >
              {userRole === "teacher" && (
                <Form.Item
                  label="Department"
                  name="department"
                >
                  <Input
                    size="large"
                    prefix={<Building size={16} />}
                    disabled={!isEditing}
                    placeholder="Enter department"
                  />
                </Form.Item>
              )}

              {userRole === "student" && (
                <>
                  <Form.Item
                    label="Major"
                    name="major"
                  >
                    <Input
                      size="large"
                      prefix={<Building size={16} />}
                      disabled={!isEditing}
                      placeholder="Enter major"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Year"
                    name="year"
                  >
                    <Input
                      size="large"
                      prefix={<Calendar size={16} />}
                      disabled={!isEditing}
                      placeholder="Enter year"
                    />
                  </Form.Item>
                </>
              )}

              <Form.Item
                label="Address"
                name="address"
              >
                <Input.TextArea
                  rows={4}
                  disabled={!isEditing}
                  placeholder="Enter address"
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        {/* Account Information */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <User size={18} style={{ color: getRoleColor() }} />
              <span className="text-base md:text-lg">Account Information</span>
            </div>
          }
          className="mt-4 md:mt-6"
          style={{ borderRadius: 12 }}
        >
          <Row gutter={[16, 12]}>
            <Col xs={24} md={8}>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Role</p>
                <p className="text-lg font-semibold" style={{ color: getRoleColor() }}>
                  {getRoleLabel()}
                </p>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Username</p>
                <p className="text-lg font-semibold text-gray-800">
                  {userInfo.username || "N/A"}
                </p>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-lg font-semibold text-green-600">Active</p>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Change Password */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Lock size={18} style={{ color: getRoleColor() }} />
              <span className="text-base md:text-lg">Change Password</span>
            </div>
          }
          className="mt-4 md:mt-6"
          style={{ borderRadius: 12 }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value && (getFieldValue('newPassword') || getFieldValue('confirmPassword'))) {
                        return Promise.reject(new Error('Please enter current password'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<Key size={16} />}
                  disabled={!isEditing}
                  placeholder="Enter current password"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value && (getFieldValue('currentPassword') || getFieldValue('confirmPassword'))) {
                        return Promise.reject(new Error('Please enter new password'));
                      }
                      if (value && value.length < 6) {
                        return Promise.reject(new Error('Password must be at least 6 characters'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<Lock size={16} />}
                  disabled={!isEditing}
                  placeholder="Enter new password"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value && (getFieldValue('currentPassword') || getFieldValue('newPassword'))) {
                        return Promise.reject(new Error('Please confirm new password'));
                      }
                      if (value && getFieldValue('newPassword') !== value) {
                        return Promise.reject(new Error('Passwords do not match'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<Lock size={16} />}
                  disabled={!isEditing}
                  placeholder="Confirm new password"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
}

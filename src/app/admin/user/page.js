"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Input,
  message,
  Table,
  Popconfirm,
  Tag,
  Modal,
  Form,
  Select,
  Tabs,
  Spin,
} from "antd";
import { Plus, Search, Edit, Trash2, Eye, Users } from "lucide-react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/user";

const { Option } = Select;

export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("student");
  const [filters, setFilters] = useState({
    department: null,
    major: null,
    level: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState({
    student: [],
    teacher: [],
    admin: [],
  });

  // Fetch all users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();

      // Group users by userType
      const groupedUsers = {
        student: data.filter((user) => user.userType === "student"),
        teacher: data.filter((user) => user.userType === "teacher"),
        admin: data.filter((user) => user.userType === "admin"),
      };

      setUsers(groupedUsers);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique departments from all users
  const departments = [
    ...new Set(
      Object.values(users)
        .flat()
        .map((user) => user.department?.name)
        .filter(Boolean)
    ),
  ];

  // Get unique majors from students
  const majors = [
    ...new Set(users.student.map((user) => user.major?.name).filter(Boolean)),
  ];

  const levels = ["1", "2", "3", "4"];

  // Filter users based on search and filters
  const getFilteredUsers = () => {
    let filtered = [...users[activeTab]];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.fullname?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.studentId?.toLowerCase().includes(query)
      );
    }

    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter(
        (user) => user.department?.name === filters.department
      );
    }

    // Apply major filter (only for students)
    if (filters.major && activeTab === "student") {
      filtered = filtered.filter((user) => user.major?.name === filters.major);
    }

    // Apply level filter (only for students)
    if (filters.level && activeTab === "student") {
      filtered = filtered.filter((user) => user.level === filters.level);
    }

    return filtered;
  };

  // Open modal for create
  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Open modal for edit
  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      fullname: record.fullname,
      studentId: record.studentId,
      email: record.email,
      phone: record.phone,
      departmentId: record.departmentId,
      majorId: record.majorId,
      level: record.level,
    });
    setIsModalVisible(true);
  };

  // View user details
  const handleView = (record) => {
    setViewingUser(record);
    setIsViewModalVisible(true);
  };

  // Delete user
  const handleDelete = async (record) => {
    try {
      await deleteUser(record.id);
      message.success(`ลบผู้ใช้ ${record.fullname} สำเร็จ`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      message.error("ไม่สามารถลบผู้ใช้ได้");
      console.error("Error deleting user:", error);
    }
  };

  // Submit form (create or update)
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.id, values);
        message.success("แก้ไขข้อมูลผู้ใช้สำเร็จ");
      } else {
        // Create new user
        await createUser({ ...values, userType: activeTab });
        message.success("เพิ่มผู้ใช้สำเร็จ");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers(); // Refresh user list
    } catch (error) {
      message.error(
        editingUser ? "ไม่สามารถแก้ไขข้อมูลได้" : "ไม่สามารถเพิ่มผู้ใช้ได้"
      );
      console.error("Error submitting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setFilters({
      department: null,
      major: null,
      level: null,
    });
    message.success("รีเซ็ตตัวกรองสำเร็จ");
  };

  // Define columns based on user type
  const getColumns = () => {
    const baseColumns = [
      {
        title: "ลำดับ",
        dataIndex: "index",
        key: "index",
        width: 70,
        align: "center",
        render: (text, record, index) => index + 1,
      },
      {
        title: "รหัส",
        dataIndex: "studentId",
        key: "userId",
        width: 120,
        render: (text) => text || "-",
      },
      {
        title: "ชื่อ-นามสกุล",
        key: "name",
        render: (_, record) => record.fullname,
      },
      {
        title: "ภาควิชา",
        key: "department",
        width: 200,
        render: (_, record) => record.department?.name || "-",
      },
    ];

    // Add Major and Level columns only for students
    if (activeTab === "student") {
      baseColumns.push(
        {
          title: "สาขาวิชา",
          key: "major",
          width: 150,
          align: "center",
          render: (_, record) => (
            <Tag color="#0A894C" style={{ borderRadius: 8 }}>
              {record.major?.name || "-"}
            </Tag>
          ),
        },
        {
          title: "ชั้นปี",
          dataIndex: "level",
          key: "level",
          width: 80,
          align: "center",
          render: (level) => (level ? `${level}` : "-"),
        }
      );
    }

    baseColumns.push({
      title: "",
      key: "action",
      width: 150,
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button
            type="text"
            icon={<Eye size={18} />}
            onClick={() => handleView(record)}
            style={{ color: "#0A894C" }}
            title="View Details"
          />
          <Button
            type="text"
            icon={<Edit size={18} />}
            onClick={() => handleEdit(record)}
            style={{ color: "#1890ff" }}
            title="Edit"
          />
          <Popconfirm
            title="Confirm Delete"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record)}
            okText="Confirm"
            cancelText="Cancel"
            okButtonProps={{
              style: { backgroundColor: "#0A894C", borderColor: "#0A894C" },
            }}
          >
            <Button
              type="text"
              icon={<Trash2 size={18} />}
              danger
              title="Delete"
            />
          </Popconfirm>
        </div>
      ),
    });

    return baseColumns;
  };

  const tabItems = [
    {
      key: "student",
      label: (
        <span className="flex items-center gap-2">
          <Users size={18} />
          นักศึกษา ({users.student.length})
        </span>
      ),
    },
    {
      key: "teacher",
      label: (
        <span className="flex items-center gap-2">
          <Users size={18} />
          อาจารย์/เจ้าหน้าที่ ภาควิชา ({users.teacher.length})
        </span>
      ),
    },
    {
      key: "admin",
      label: (
        <span className="flex items-center gap-2">
          <Users size={18} />
          แอดมิน/เจ้าหน้าที่คณะ ({users.admin.length})
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Tabs for User Types */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          setFilters({ department: null, major: null, level: null });
          setSearchQuery("");
        }}
        items={tabItems}
        size="large"
        className="custom-user-tabs mb-4"
      />

      {/* Search and Filter Bar */}
      <div
        className="p-4 rounded-lg mb-4"
        style={{
          background: "#ffffff",
          border: "1px solid #e8f5e9",
          boxShadow: "0 2px 8px rgba(10, 137, 76, 0.08)",
        }}
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <Input
              placeholder="Search by name or ID..."
              prefix={<Search size={16} style={{ color: "#0A894C" }} />}
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              size="large"
              style={{ borderColor: "#0A894C" }}
            />
          </div>

          <div className="col-span-12 md:col-span-2">
            <Select
              placeholder="Department"
              onChange={(value) =>
                setFilters({ ...filters, department: value })
              }
              value={filters.department}
              allowClear
              size="large"
              style={{ width: "100%" }}
            >
              {departments.map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </div>

          {activeTab === "student" && (
            <>
              <div className="col-span-12 md:col-span-2">
                <Select
                  placeholder="Major"
                  onChange={(value) => setFilters({ ...filters, major: value })}
                  value={filters.major}
                  allowClear
                  size="large"
                  style={{ width: "100%" }}
                >
                  {majors.map((major) => (
                    <Option key={major} value={major}>
                      {major}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="col-span-12 md:col-span-2">
                <Select
                  placeholder="Level"
                  onChange={(value) => setFilters({ ...filters, level: value })}
                  value={filters.level}
                  allowClear
                  size="large"
                  style={{ width: "100%" }}
                >
                  {levels.map((level) => (
                    <Option key={level} value={level}>
                      Year {level}
                    </Option>
                  ))}
                </Select>
              </div>
            </>
          )}

          <div
            className={`col-span-12 md:col-span-${
              activeTab === "student" ? "2" : "6"
            } flex gap-2`}
          >
            <Button
              onClick={handleReset}
              size="large"
              style={{
                backgroundColor: "#6c757d",
                borderColor: "#6c757d",
                color: "#ffffff",
              }}
            >
              Reset
            </Button>
            <Button
              type="primary"
              icon={<Plus size={18} />}
              onClick={handleCreate}
              size="large"
              style={{
                backgroundColor: "#0A894C",
                borderColor: "#0A894C",
                flex: 1,
              }}
            >
              Add New
            </Button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card
        style={{
          borderRadius: 8,
          border: "1px solid #e8f5e9",
          boxShadow: "0 2px 8px rgba(10, 137, 76, 0.08)",
        }}
      >
        <Spin spinning={loading}>
          <Table
            columns={getColumns()}
            dataSource={getFilteredUsers()}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} users`,
            }}
            scroll={{ x: 800 }}
          />
        </Spin>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <h3 className="text-lg font-semibold" style={{ color: "#0A894C" }}>
            {editingUser ? "Edit User" : "Add New User"}
          </h3>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingUser ? "Save" : "Create"}
        cancelText="Cancel"
        width={600}
        okButtonProps={{
          style: { backgroundColor: "#0A894C", borderColor: "#0A894C" },
        }}
        styles={{
          header: {
            borderBottom: "2px solid #0A894C",
            paddingBottom: 16,
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            label="Full Name"
            name="fullname"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>

          {activeTab === "student" && (
            <Form.Item
              label="Student ID"
              name="studentId"
              rules={[{ required: true, message: "Please enter student ID" }]}
            >
              <Input placeholder="Student ID" />
            </Form.Item>
          )}

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter valid email" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            label="Department"
            name="departmentId"
            rules={[{ required: true, message: "Please select department" }]}
          >
            <Select placeholder="Select Department">
              {Object.values(users)
                .flat()
                .filter(
                  (user, index, self) =>
                    user.department &&
                    self.findIndex(
                      (u) => u.department?.id === user.department?.id
                    ) === index
                )
                .map((user) => (
                  <Option key={user.department.id} value={user.department.id}>
                    {user.department.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          {activeTab === "student" && (
            <>
              <Form.Item
                label="Major"
                name="majorId"
                rules={[{ required: true, message: "Please select major" }]}
              >
                <Select placeholder="Select Major">
                  {users.student
                    .filter(
                      (user, index, self) =>
                        user.major &&
                        self.findIndex(
                          (u) => u.major?.id === user.major?.id
                        ) === index
                    )
                    .map((user) => (
                      <Option key={user.major.id} value={user.major.id}>
                        {user.major.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Level"
                name="level"
                rules={[{ message: "Please select level" }]}
              >
                <Select placeholder="Select Level">
                  {levels.map((level) => (
                    <Option key={level} value={level}>
                      Year {level}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title={
          <h3 className="text-lg font-semibold" style={{ color: "#0A894C" }}>
            User Details
          </h3>
        }
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
        styles={{
          header: {
            borderBottom: "2px solid #0A894C",
            paddingBottom: 16,
          },
        }}
      >
        {viewingUser && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="font-semibold text-gray-700">Name:</label>
              <p className="text-gray-600 mt-1">{viewingUser.fullname}</p>
            </div>
            {viewingUser.studentId && (
              <div>
                <label className="font-semibold text-gray-700">
                  Student ID:
                </label>
                <p className="text-gray-600 mt-1">{viewingUser.studentId}</p>
              </div>
            )}
            <div>
              <label className="font-semibold text-gray-700">Email:</label>
              <p className="text-gray-600 mt-1">{viewingUser.email}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Phone:</label>
              <p className="text-gray-600 mt-1">{viewingUser.phone}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Department:</label>
              <p className="text-gray-600 mt-1">
                {viewingUser.department?.name || "-"}
              </p>
            </div>
            {viewingUser.major && (
              <div>
                <label className="font-semibold text-gray-700">Major:</label>
                <p className="text-gray-600 mt-1">
                  <Tag color="#0A894C">{viewingUser.major.name}</Tag>
                </p>
              </div>
            )}
            {viewingUser.level && (
              <div>
                <label className="font-semibold text-gray-700">Level:</label>
                <p className="text-gray-600 mt-1">Year {viewingUser.level}</p>
              </div>
            )}
            {viewingUser.birthday && (
              <div>
                <label className="font-semibold text-gray-700">Birthday:</label>
                <p className="text-gray-600 mt-1">{viewingUser.birthday}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .custom-user-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #0a894c !important;
          font-weight: 600 !important;
        }
        .custom-user-tabs .ant-tabs-ink-bar {
          background: #0a894c !important;
          height: 3px !important;
        }
        .custom-user-tabs .ant-tabs-tab:hover {
          color: #0a894c !important;
        }
      `}</style>
    </div>
  );
}

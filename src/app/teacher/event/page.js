"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input, message, Table, Popconfirm, Tag, Modal, Form, Select, Upload } from "antd";
import { Plus, Search, Edit, Trash2, Eye, Upload as UploadIcon } from "lucide-react";

const { Option } = Select;

export default function TeacherEventPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userDepartment, setUserDepartment] = useState("Computer Education");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // อ่านข้อมูลภาควิชาของครูจาก localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.department) {
          setUserDepartment(userData.department);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        message.error("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      }
    }
  }, []);

  // Mock data
  const [events, setEvents] = useState([
    {
      id: 1,
      activityName: "Community Service Project",
      departments: ["Computer Education"],
      majors: ["TCT"],
      yearLevels: ["1", "2"],
      category: "กิจกรรมบำเพ็ญประโยชน์/จิตอาสา",
      studentCount: 15,
      maxStudents: 30,
      description: "Community service volunteer activity",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      location: "Ban Suan Dok Community",
      activityHours: 20,
      activityDeadline: "2024-01-25",
      remarks: "Bring your own supplies",
      imageUrl: null,
    },
    {
      id: 2,
      activityName: "Technology Training Workshop",
      departments: ["Electrical Engineering"],
      majors: ["CED"],
      yearLevels: ["3", "4"],
      category: "กิจกรรมวิชาการ",
      studentCount: 28,
      maxStudents: 30,
      description: "New technology training workshop",
      startDate: "2024-02-10",
      endDate: "2024-02-12",
      location: "Room 301 Building 3",
      activityHours: 15,
      activityDeadline: "2024-02-05",
      remarks: "Laptop required",
      imageUrl: null,
    },
    {
      id: 3,
      activityName: "Programming Skills Development",
      departments: ["Computer Education"],
      majors: ["TCT", "CED"],
      yearLevels: ["2", "3"],
      category: "กิจกรรมวิชาการ",
      studentCount: 10,
      maxStudents: 25,
      description: "Programming skills development workshop",
      startDate: "2024-02-15",
      endDate: "2024-02-20",
      location: "Computer Laboratory",
      activityHours: 30,
      activityDeadline: "2024-02-10",
      remarks: "",
      imageUrl: null,
    },
  ]);

  const departments = [
    "Computer Education",
    "Civil Engineering Education",
    "Electrical Engineering Education",
    "Mechanical Engineering Education",
    "Information Technology Education",
    "Technical Education Administration",
  ];

  const majors = ["TCT", "CED"];

  const yearLevels = ["1", "2", "3", "4"];

  const categoryNames = [
    "กิจกรรมวิชาการ",
    "กิจกรรมกีฬา/นันทนาการ",
    "กิจกรรมบำเพ็ญประโยชน์/จิตอาสา",
    "กิจกรรมนิสิตสัมพันธ์",
    "กิจกรรมศิลปวัฒนธรรม",
    "กิจกรรมเสริมสร้างคุณธรรม จริยธรรม",
  ];

  // Filter events based on teacher's department, search, and category
  const getFilteredEvents = () => {
    let filtered = [...events];

    // Filter by teacher's department automatically
    filtered = filtered.filter((event) =>
      event.departments?.includes(userDepartment)
    );

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((event) =>
        event.activityName.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((event) =>
        event.category === selectedCategory
      );
    }

    return filtered;
  };

  // Calculate summary statistics
  const getSummary = () => {
    const filtered = getFilteredEvents();
    const totalActivities = filtered.length;
    const totalHours = filtered.reduce((sum, event) => sum + (event.activityHours || 0), 0);
    return { totalActivities, totalHours };
  };

  // Open modal for create
  const handleCreate = () => {
    setEditingEvent(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Open modal for edit
  const handleEdit = (record) => {
    setEditingEvent(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // View event details
  const handleView = (record) => {
    setViewingEvent(record);
    setIsViewModalVisible(true);
  };

  // Delete event
  const handleDelete = (record) => {
    setEvents(events.filter((event) => event.id !== record.id));
    message.success(`Deleted event "${record.activityName}" successfully`);
  };

  // Submit form (create or update)
  const handleSubmit = (values) => {
    if (editingEvent) {
      // Update existing event
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id
            ? { ...event, ...values }
            : event
        )
      );
      message.success("Event updated successfully");
    } else {
      // Create new event
      const newEvent = {
        id: Math.max(...events.map((e) => e.id)) + 1,
        ...values,
        studentCount: 0,
      };
      setEvents([...events, newEvent]);
      message.success("Event created successfully");
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      width: 80,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Activity",
      dataIndex: "activityName",
      key: "activityName",
      ellipsis: true,
    },
    {
      title: "Department",
      dataIndex: "departments",
      key: "departments",
      width: 200,
      render: (departments) => (
        <div className="flex flex-wrap gap-1">
          {departments?.slice(0, 2).map((dept, idx) => (
            <span key={idx} className="text-xs text-gray-600">
              {dept}
              {idx < Math.min(departments.length - 1, 1) && ","}
            </span>
          ))}
          {departments?.length > 2 && (
            <span className="text-xs text-gray-500">+{departments.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      title: "Major",
      dataIndex: "majors",
      key: "majors",
      width: 120,
      align: "center",
      render: (majors) => (
        <div className="flex flex-wrap gap-1 justify-center">
          {majors?.map((major, idx) => (
            <Tag
              key={idx}
              color="#0A894C"
              style={{
                borderRadius: 8,
                fontWeight: 500,
                fontSize: "11px",
              }}
            >
              {major}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Students",
      dataIndex: "studentCount",
      key: "studentCount",
      width: 150,
      align: "center",
      render: (count, record) => {
        const percentage = (count / record.maxStudents) * 100;
        const color =
          percentage >= 80 ? "#f5222d" : percentage >= 50 ? "#fa8c16" : "#0A894C";

        return (
          <span
            style={{
              color: color,
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {count}/{record.maxStudents}
          </span>
        );
      },
    },
    {
      title: "Actions",
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
            description="Are you sure you want to delete this event?"
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
    },
  ];

  return (
    <div>
      {/* Department Banner */}
      <Card
        className="mb-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #0A894C 0%, #0ea258 100%)",
          border: "none",
        }}
      >
        <div className="text-white">
          <h2 className="text-xl font-bold mb-1">ภาควิชา {userDepartment}</h2>
          <p className="text-sm opacity-90">
            จัดการกิจกรรมของภาควิชา
          </p>
        </div>
      </Card>

      {/* Header with Search and Create Button */}
      <div
        className="p-4 rounded-lg mb-4"
        style={{
          background: "#ffffff",
          border: "1px solid #e8f5e9",
          boxShadow: "0 2px 8px rgba(10, 137, 76, 0.08)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <Input
            placeholder="Search event name..."
            prefix={<Search size={16} style={{ color: "#0A894C" }} />}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="large"
            style={{
              maxWidth: 400,
              borderColor: "#0A894C",
            }}
          />
          <Button
            type="primary"
            icon={<Plus size={18} />}
            onClick={handleCreate}
            size="large"
            style={{
              backgroundColor: "#0A894C",
              borderColor: "#0A894C",
            }}
          >
            Create Event
          </Button>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Filter by Category:
            </label>
            <Select
              placeholder="All Categories"
              allowClear
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ minWidth: 280 }}
              size="middle"
            >
              {categoryNames.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </div>

          {selectedCategory && (
            <Button
              size="small"
              onClick={() => setSelectedCategory(null)}
              style={{ color: "#0A894C", borderColor: "#0A894C" }}
            >
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card
          style={{
            borderRadius: 8,
            border: "1px solid #e8f5e9",
            boxShadow: "0 2px 8px rgba(10, 137, 76, 0.08)",
            background: "linear-gradient(135deg, #0A894C 0%, #0ea258 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm mb-1 opacity-90">Total Activities</p>
              <h2 className="text-white text-3xl font-bold">{getSummary().totalActivities}</h2>
            </div>
            <div
              className="p-4 rounded-full"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <Search size={32} className="text-white" />
            </div>
          </div>
        </Card>

        <Card
          style={{
            borderRadius: 8,
            border: "1px solid #e8f5e9",
            boxShadow: "0 2px 8px rgba(10, 137, 76, 0.08)",
            background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm mb-1 opacity-90">Total Activity Hours</p>
              <h2 className="text-white text-3xl font-bold">{getSummary().totalHours}</h2>
            </div>
            <div
              className="p-4 rounded-full"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <Plus size={32} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Events Table */}
      <Card
        style={{
          borderRadius: 8,
          border: "1px solid #e8f5e9",
          boxShadow: "0 2px 8px rgba(10, 137, 76, 0.08)",
        }}
      >
        <Table
          columns={columns}
          dataSource={getFilteredEvents()}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <h3 className="text-lg font-semibold" style={{ color: "#0A894C" }}>
            {editingEvent ? "Edit Event" : "Create New Event"}
          </h3>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingEvent ? "Save" : "Create"}
        cancelText="Cancel"
        width={800}
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
            label="ภาควิชา (Department)"
            name="departments"
            rules={[{ required: true, message: "Please select at least one department" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select departments"
              style={{ width: "100%" }}
            >
              {departments.map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="สาขาวิชา (Major)"
            name="majors"
            rules={[{ required: true, message: "Please select at least one major" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select majors"
              style={{ width: "100%" }}
            >
              {majors.map((major) => (
                <Option key={major} value={major}>
                  {major}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="ชื่อกิจกรรม (Activity Name)"
            name="activityName"
            rules={[{ required: true, message: "Please enter activity name" }]}
          >
            <Input placeholder="Activity Name" />
          </Form.Item>

          <Form.Item
            label="รายละเอียด (Description)"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={4} placeholder="Activity Description" />
          </Form.Item>

          <Form.Item
            label="ระดับชั้นปี (Year Level)"
            name="yearLevels"
            rules={[{ required: true, message: "Please select at least one year level" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select year levels"
              style={{ width: "100%" }}
            >
              {yearLevels.map((year) => (
                <Option key={year} value={year}>
                  Year {year}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="ระยะเวลาที่จัด - เริ่ม (Start Date)"
              name="startDate"
              rules={[{ required: true, message: "Please select start date" }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              label="ระยะเวลาที่จัด - สิ้นสุด (End Date)"
              name="endDate"
              rules={[{ required: true, message: "Please select end date" }]}
            >
              <Input type="date" />
            </Form.Item>
          </div>

          <Form.Item
            label="สถานที่ (Location)"
            name="location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="Event Location" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="จำนวนชั่วโมงกิจกรรม (Activity Hours)"
              name="activityHours"
              rules={[{ required: true, message: "Please enter activity hours" }]}
            >
              <Input type="number" placeholder="Hours" min={1} />
            </Form.Item>

            <Form.Item
              label="จำนวนนักศึกษาสูงสุด (Max Students)"
              name="maxStudents"
              rules={[{ required: true, message: "Please enter max students" }]}
            >
              <Input type="number" placeholder="Max Students" min={1} />
            </Form.Item>
          </div>

          <Form.Item
            label="ภาพประกอบ (Image)"
            name="imageUrl"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              <div>
                <UploadIcon size={20} />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            label="กำหนดเวลากิจกรรม (Activity Deadline)"
            name="activityDeadline"
            rules={[{ required: true, message: "Please select deadline" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="หมายเหตุ (Remarks)"
            name="remarks"
          >
            <Input.TextArea rows={2} placeholder="Additional notes or remarks" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title={
          <h3 className="text-lg font-semibold" style={{ color: "#0A894C" }}>
            Event Details
          </h3>
        }
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
        styles={{
          header: {
            borderBottom: "2px solid #0A894C",
            paddingBottom: 16,
          },
        }}
      >
        {viewingEvent && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="font-semibold text-gray-700">ชื่อกิจกรรม (Activity Name):</label>
              <p className="text-gray-600 mt-1">{viewingEvent.activityName}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">ภาควิชา (Department):</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {viewingEvent.departments?.map((dept, idx) => (
                  <Tag key={idx} color="blue">{dept}</Tag>
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">สาขาวิชา (Major):</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {viewingEvent.majors?.map((major, idx) => (
                  <Tag key={idx} color="#0A894C">{major}</Tag>
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">ระดับชั้นปี (Year Level):</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {viewingEvent.yearLevels?.map((year, idx) => (
                  <Tag key={idx} color="purple">Year {year}</Tag>
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">รายละเอียด (Description):</label>
              <p className="text-gray-600 mt-1">{viewingEvent.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700">ระยะเวลาที่จัด (Duration):</label>
                <p className="text-gray-600 mt-1">
                  {viewingEvent.startDate} to {viewingEvent.endDate}
                </p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">สถานที่ (Location):</label>
                <p className="text-gray-600 mt-1">{viewingEvent.location}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700">จำนวนชั่วโมง (Activity Hours):</label>
                <p className="text-gray-600 mt-1">{viewingEvent.activityHours} hours</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">นักศึกษา (Students):</label>
                <p className="text-gray-600 mt-1">
                  {viewingEvent.studentCount}/{viewingEvent.maxStudents} students
                </p>
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">กำหนดเวลา (Deadline):</label>
              <p className="text-gray-600 mt-1">{viewingEvent.activityDeadline}</p>
            </div>
            {viewingEvent.remarks && (
              <div>
                <label className="font-semibold text-gray-700">หมายเหตุ (Remarks):</label>
                <p className="text-gray-600 mt-1">{viewingEvent.remarks}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

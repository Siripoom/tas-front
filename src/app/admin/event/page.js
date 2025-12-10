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
  Upload,
  Spin,
} from "antd";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Upload as UploadIcon,
} from "lucide-react";
import {
  getAllActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from "@/services/activity";
import { getAllDepartments } from "@/services/department";
import { getAllTypeActivities } from "@/services/typeActivity";
import { getAllUsers } from "@/services/user";

const { Option } = Select;

export default function EventPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [typeActivities, setTypeActivities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch activities, type activities, and users
      const [activitiesData, typeActivitiesData, usersData] = await Promise.all(
        [getAllActivities(), getAllTypeActivities(), getAllUsers()]
      );

      setEvents(activitiesData);
      setTypeActivities(typeActivitiesData);

      // Extract unique departments with IDs
      const departmentMap = new Map();
      usersData.forEach((user) => {
        if (user.department) {
          departmentMap.set(user.department.id, user.department);
        }
      });
      const uniqueDepartments = Array.from(departmentMap.values());

      // Extract unique majors with IDs
      const majorMap = new Map();
      usersData.forEach((user) => {
        if (user.major) {
          majorMap.set(user.major.id, user.major);
        }
      });
      const uniqueMajors = Array.from(majorMap.values());

      setDepartments(uniqueDepartments);
      setMajors(uniqueMajors);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลกิจกรรมได้");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const yearLevels = ["1", "2", "3", "4"];

  // Filter events based on search, department, and category
  const getFilteredEvents = () => {
    let filtered = [...events];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((event) =>
        event.name?.toLowerCase().includes(query)
      );
    }

    // Apply department filter
    if (selectedDepartment) {
      filtered = filtered.filter(
        (event) => event.department?.name === selectedDepartment
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (event) => event.typeActivity?.id === selectedCategory
      );
    }

    return filtered;
  };

  // Calculate summary statistics
  const getSummary = () => {
    const filtered = getFilteredEvents();
    const totalActivities = filtered.length;
    const totalHours = filtered.reduce(
      (sum, event) => sum + (event.hour || 0),
      0
    );
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
    // Map API data to form fields
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      departmentId: record.departmentId,
      typeActivityId: record.typeActivityId,
      majorIds: record.majorJoins?.map((mj) => mj.majorId) || [],
      level: record.level,
      startDate: record.startDate?.split("T")[0],
      endDate: record.endDate?.split("T")[0],
      address: record.address,
      hour: record.hour,
      maxPeopleCount: record.maxPeopleCount,
      remarks: record.remarks,
      pdfDocument: record.pdfDocument
        ? [
            {
              uid: "-1",
              name: record.pdfDocument.split("/").pop() || "document.pdf",
              status: "done",
              url: record.pdfDocument,
            },
          ]
        : [],
    });
    setIsModalVisible(true);
  };

  // View event details
  const handleView = (record) => {
    setViewingEvent(record);
    setIsViewModalVisible(true);
  };

  // Delete event
  const handleDelete = async (record) => {
    try {
      await deleteActivity(record.id);
      message.success(`ลบกิจกรรม "${record.name}" สำเร็จ`);
      fetchData(); // Refresh events list
    } catch (error) {
      message.error("ไม่สามารถลบกิจกรรมได้");
      console.error("Error deleting activity:", error);
    }
  };

  // Submit form (create or update)
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Get current user from localStorage
      const userStr = localStorage.getItem("user");
      const currentUser = userStr ? JSON.parse(userStr) : null;

      // Prepare FormData for API
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("departmentId", values.departmentId);
      formData.append("typeActivityId", values.typeActivityId);
      formData.append("level", values.level);
      formData.append("startDate", new Date(values.startDate).toISOString());
      formData.append("endDate", new Date(values.endDate).toISOString());
      formData.append("address", values.address);
      formData.append("hour", parseInt(values.hour));
      formData.append("date", new Date(values.startDate).toISOString());
      formData.append("maxPeopleCount", parseInt(values.maxPeopleCount));
      formData.append("responsibleId", currentUser?.id || "");
      formData.append("peopleCount", 0);
      formData.append("year", new Date(values.startDate).getFullYear() + 543);
      formData.append("status", "planned");

      // Handle major IDs (array)
      if (values.majorIds && values.majorIds.length > 0) {
        values.majorIds.forEach((majorId) => {
          formData.append("majorIds", majorId);
        });
      }

      // Handle PDF file upload
      if (values.pdfDocument && values.pdfDocument.length > 0) {
        const file = values.pdfDocument[0];
        if (file.originFileObj) {
          // New file to upload
          formData.append("pdfDocument", file.originFileObj);
        } else if (file.url) {
          // Existing file URL
          formData.append("pdfDocumentUrl", file.url);
        }
      }

      if (editingEvent) {
        // Update existing event
        await updateActivity(editingEvent.id, formData);
        message.success("แก้ไขกิจกรรมสำเร็จ");
      } else {
        // Create new event
        await createActivity(formData);
        message.success("เพิ่มกิจกรรมสำเร็จ");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchData(); // Refresh events list
    } catch (error) {
      message.error(
        editingEvent ? "ไม่สามารถแก้ไขกิจกรรมได้" : "ไม่สามารถเพิ่มกิจกรรมได้"
      );
      console.error("Error submitting activity:", error);
    } finally {
      setLoading(false);
    }
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
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Department",
      key: "department",
      width: 200,
      render: (_, record) => (
        <span className="text-xs text-gray-600">
          {record.department?.name || "-"}
        </span>
      ),
    },
    {
      title: "Major",
      key: "majors",
      width: 150,
      align: "center",
      render: (_, record) => (
        <div className="flex flex-wrap gap-1 justify-center">
          {record.majorJoins?.map((mj, idx) => (
            <Tag
              key={idx}
              color="#0A894C"
              style={{
                borderRadius: 8,
                fontWeight: 500,
                fontSize: "11px",
              }}
            >
              {mj.major?.name || "N/A"}
            </Tag>
          ))}
          {(!record.majorJoins || record.majorJoins.length === 0) && (
            <span className="text-xs text-gray-400">ทุกสาขา</span>
          )}
        </div>
      ),
    },
    {
      title: "Students",
      key: "studentCount",
      width: 150,
      align: "center",
      render: (_, record) => {
        const count = record.peopleCount || 0;
        const max = record.maxPeopleCount || 0;
        const percentage = max > 0 ? (count / max) * 100 : 0;
        const color =
          percentage >= 80
            ? "#f5222d"
            : percentage >= 50
            ? "#fa8c16"
            : "#0A894C";

        return (
          <span
            style={{
              color: color,
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {count}/{max}
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
            title="ยืนยันการลบ"
            description="คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้?"
            onConfirm={() => handleDelete(record)}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
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
              Filter by Department:
            </label>
            <Select
              placeholder="All Departments"
              allowClear
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              style={{ minWidth: 250 }}
              size="middle"
            >
              {departments.map((dept) => (
                <Option key={dept.id} value={dept.name}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </div>

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
              {typeActivities.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </div>

          {(selectedDepartment || selectedCategory) && (
            <Button
              size="small"
              onClick={() => {
                setSelectedDepartment(null);
                setSelectedCategory(null);
              }}
              style={{ color: "#0A894C", borderColor: "#0A894C" }}
            >
              Clear All Filters
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
              <p className="text-white text-sm mb-1 opacity-90">
                Total Activities
              </p>
              <h2 className="text-white text-3xl font-bold">
                {getSummary().totalActivities}
              </h2>
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
              <p className="text-white text-sm mb-1 opacity-90">
                Total Activity Hours
              </p>
              <h2 className="text-white text-3xl font-bold">
                {getSummary().totalHours}
              </h2>
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
        <Spin spinning={loading}>
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
        </Spin>
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
            label="ชื่อกิจกรรม (Activity Name)"
            name="name"
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
            label="ภาควิชา (Department)"
            name="departmentId"
            rules={[{ required: true, message: "Please select department" }]}
          >
            <Select placeholder="Select department" style={{ width: "100%" }}>
              {departments.map((dept) => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="ประเภทกิจกรรม (Category)"
            name="typeActivityId"
            rules={[{ required: true, message: "Please select activity type" }]}
          >
            <Select placeholder="Select category" style={{ width: "100%" }}>
              {typeActivities.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="สาขาวิชา (Major - เลือกได้หลายสาขา)"
            name="majorIds"
          >
            <Select
              mode="multiple"
              placeholder="Select majors (ถ้าไม่เลือก = ทุกสาขา)"
              style={{ width: "100%" }}
            >
              {majors.map((major) => (
                <Option key={major.id} value={major.id}>
                  {major.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="ระดับชั้นปี (Year Level)"
            name="level"
            rules={[{ required: true, message: "Please select year level" }]}
          >
            <Select placeholder="Select year level" style={{ width: "100%" }}>
              {yearLevels.map((year) => (
                <Option key={year} value={`ปี ${year}`}>
                  ปี {year}
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
            name="address"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="Event Location" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="จำนวนชั่วโมงกิจกรรม (Activity Hours)"
              name="hour"
              rules={[
                { required: true, message: "Please enter activity hours" },
              ]}
            >
              <Input type="number" placeholder="Hours" min={1} />
            </Form.Item>

            <Form.Item
              label="จำนวนนักศึกษาสูงสุด (Max Students)"
              name="maxPeopleCount"
              rules={[{ required: true, message: "Please enter max students" }]}
            >
              <Input type="number" placeholder="Max Students" min={1} />
            </Form.Item>
          </div>

          <Form.Item label="หมายเหตุ (Remarks)" name="remarks">
            <Input.TextArea
              rows={3}
              placeholder="Additional notes or remarks"
            />
          </Form.Item>

          {/* upload file pdf */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">
              อัปโหลดเอกสาร PDF (Upload PDF Document)
            </label>
            <Form.Item
              name="pdfDocument"
              valuePropName="fileList"
              getValueFromEvent={(e) =>
                Array.isArray(e) ? e : e && e.fileList
              }
            >
              <Upload
                name="pdf"
                listType="text"
                accept=".pdf"
                maxCount={1}
                beforeUpload={() => false}
              >
                <Button icon={<UploadIcon size={16} />}>
                  Click to Upload PDF
                </Button>
              </Upload>
            </Form.Item>
          </div>
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
              <label className="font-semibold text-gray-700">
                ชื่อกิจกรรม (Activity Name):
              </label>
              <p className="text-gray-600 mt-1">{viewingEvent.name}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                รายละเอียด (Description):
              </label>
              <p className="text-gray-600 mt-1">{viewingEvent.description}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                ภาควิชา (Department):
              </label>
              <div className="mt-1">
                <Tag color="blue">{viewingEvent.department?.name || "-"}</Tag>
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                ประเภทกิจกรรม (Category):
              </label>
              <div className="mt-1">
                <Tag color="green">
                  {viewingEvent.typeActivity?.name || "-"}
                </Tag>
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                สาขาวิชา (Major):
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {viewingEvent.majorJoins &&
                viewingEvent.majorJoins.length > 0 ? (
                  viewingEvent.majorJoins.map((mj, idx) => (
                    <Tag key={idx} color="#0A894C">
                      {mj.major?.name}
                    </Tag>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">ทุกสาขา</span>
                )}
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                ระดับชั้นปี (Year Level):
              </label>
              <div className="mt-1">
                <Tag color="purple">{viewingEvent.level || "-"}</Tag>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700">
                  ระยะเวลาที่จัด (Duration):
                </label>
                <p className="text-gray-600 mt-1">
                  {viewingEvent.startDate?.split("T")[0]} to{" "}
                  {viewingEvent.endDate?.split("T")[0]}
                </p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">
                  สถานที่ (Location):
                </label>
                <p className="text-gray-600 mt-1">{viewingEvent.address}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700">
                  จำนวนชั่วโมง (Activity Hours):
                </label>
                <p className="text-gray-600 mt-1">{viewingEvent.hour} hours</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">
                  นักศึกษา (Students):
                </label>
                <p className="text-gray-600 mt-1">
                  {viewingEvent.peopleCount}/{viewingEvent.maxPeopleCount}{" "}
                  students
                </p>
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                สถานะ (Status):
              </label>
              <div className="mt-1">
                <Tag
                  color={
                    viewingEvent.status === "completed"
                      ? "green"
                      : viewingEvent.status === "inprogress"
                      ? "blue"
                      : viewingEvent.status === "cancelled"
                      ? "red"
                      : "orange"
                  }
                >
                  {viewingEvent.status}
                </Tag>
              </div>
            </div>
            {viewingEvent.remarks && (
              <div>
                <label className="font-semibold text-gray-700">
                  หมายเหตุ (Remarks):
                </label>
                <p className="text-gray-600 mt-1">{viewingEvent.remarks}</p>
              </div>
            )}
            {viewingEvent.pdfDocument && (
              <div>
                <label className="font-semibold text-gray-700">
                  เอกสาร PDF (PDF Document):
                </label>
                <div className="mt-2">
                  <a
                    href={viewingEvent.pdfDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {viewingEvent.pdfDocument.split("/").pop() ||
                        "View Document"}
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

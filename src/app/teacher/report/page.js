"use client";

import { useState, useEffect } from "react";
import { Card, Input, Table, Button, Modal, Tag, Avatar, Space, message } from "antd";
import { Search, FileText, Download, Printer, User, Calendar, MapPin, Clock } from "lucide-react";

const { Search: SearchInput } = Input;

export default function TeacherReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userDepartment, setUserDepartment] = useState("Computer Education");
  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Read user department from localStorage
  useEffect(() => {
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

  // Mock data for activities with student participation
  const mockActivities = [
    {
      id: 1,
      activityName: "Community Service Project",
      department: "Computer Education",
      major: "TCT",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      location: "Ban Suan Dok Community",
      activityHours: 20,
      studentCount: 15,
      students: [
        {
          id: 1,
          studentId: "6501101001",
          name: "John Doe",
          department: "Computer Education",
          major: "TCT",
          year: "3",
          participationDate: "2024-02-01",
          status: "completed",
        },
        {
          id: 2,
          studentId: "6501101002",
          name: "Jane Smith",
          department: "Computer Education",
          major: "CED",
          year: "2",
          participationDate: "2024-02-01",
          status: "completed",
        },
        {
          id: 3,
          studentId: "6501101003",
          name: "Bob Johnson",
          department: "Computer Education",
          major: "TCT",
          year: "4",
          participationDate: "2024-02-01",
          status: "completed",
        },
      ],
    },
    {
      id: 2,
      activityName: "Technology Training Workshop",
      department: "Electrical Engineering",
      major: "CED",
      startDate: "2024-02-10",
      endDate: "2024-02-12",
      location: "Engineering Building",
      activityHours: 15,
      studentCount: 28,
      students: [
        {
          id: 4,
          studentId: "6501101004",
          name: "Alice Williams",
          department: "Electrical Engineering",
          major: "CED",
          year: "3",
          participationDate: "2024-02-10",
          status: "completed",
        },
        {
          id: 5,
          studentId: "6501101005",
          name: "Charlie Brown",
          department: "Electrical Engineering",
          major: "CED",
          year: "2",
          participationDate: "2024-02-10",
          status: "completed",
        },
      ],
    },
    {
      id: 3,
      activityName: "Programming Skills Development",
      department: "Computer Education",
      major: "TCT",
      startDate: "2024-03-01",
      endDate: "2024-03-03",
      location: "Computer Lab 301",
      activityHours: 12,
      studentCount: 10,
      students: [
        {
          id: 6,
          studentId: "6501101006",
          name: "David Lee",
          department: "Computer Education",
          major: "TCT",
          year: "1",
          participationDate: "2024-03-01",
          status: "completed",
        },
      ],
    },
  ];

  // Filter activities based on search query
  const getFilteredActivities = () => {
    // Automatically filter by teacher's department first
    let filtered = mockActivities.filter(
      (activity) => activity.department === userDepartment
    );

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.activityName.toLowerCase().includes(query) ||
          activity.department.toLowerCase().includes(query) ||
          activity.major.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleViewStudents = (activity) => {
    setSelectedActivity(activity);
    setStudentModalVisible(true);
  };

  const handleDownload = (student) => {
    // In a real application, this would generate and download a PDF
    console.log(`Downloading document for ${student.name}`);
    alert(`Downloading document for ${student.name}`);
  };

  const handlePrint = (student) => {
    // In a real application, this would open a print dialog
    console.log(`Printing document for ${student.name}`);
    window.print();
  };

  const activityColumns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      width: 70,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Activity Name",
      dataIndex: "activityName",
      key: "activityName",
      render: (name) => (
        <div className="font-medium" style={{ color: "#0A894C" }}>
          <FileText size={16} className="inline mr-2" />
          {name}
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 200,
    },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
      width: 100,
      align: "center",
      render: (major) => (
        <Tag color="#0A894C" style={{ borderRadius: 8 }}>
          {major}
        </Tag>
      ),
    },
    {
      title: "Date",
      key: "date",
      width: 180,
      align: "center",
      render: (_, record) => (
        <div className="text-sm">
          <Calendar size={14} className="inline mr-1" />
          {record.startDate} - {record.endDate}
        </div>
      ),
    },
    {
      title: "Students",
      dataIndex: "studentCount",
      key: "studentCount",
      width: 100,
      align: "center",
      render: (count) => (
        <Tag color="#1890ff" style={{ borderRadius: 8, fontWeight: 500 }}>
          {count} students
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleViewStudents(record)}
          style={{
            backgroundColor: "#0A894C",
            borderColor: "#0A894C",
          }}
        >
          View Students
        </Button>
      ),
    },
  ];

  const studentColumns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            size={32}
            style={{ backgroundColor: "#0A894C" }}
            icon={<User size={18} />}
          />
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-xs text-gray-500">{record.studentId}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 180,
    },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
      width: 100,
      align: "center",
      render: (major) => (
        <Tag color="#0A894C" style={{ borderRadius: 8 }}>
          {major}
        </Tag>
      ),
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 80,
      align: "center",
      render: (year) => `Year ${year}`,
    },
    {
      title: "Participation Date",
      dataIndex: "participationDate",
      key: "participationDate",
      width: 140,
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => (
        <Tag
          color={status === "completed" ? "#0A894C" : "#fa8c16"}
          style={{ borderRadius: 8, fontWeight: 500 }}
        >
          {status === "completed" ? "Completed" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 180,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<Download size={14} />}
            onClick={() => handleDownload(record)}
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              color: "#ffffff",
            }}
          >
            Download
          </Button>
          <Button
            size="small"
            icon={<Printer size={14} />}
            onClick={() => handlePrint(record)}
            style={{
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              color: "#ffffff",
            }}
          >
            Print
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Department Banner */}
      <Card
        className="mb-6 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #0A894C 0%, #0ea258 100%)",
          border: "none",
        }}
      >
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-2">ภาควิชา {userDepartment}</h2>
          <p className="text-sm opacity-90">
            รายงานกิจกรรมและการเข้าร่วมของนักศึกษาในภาควิชา
          </p>
        </div>
      </Card>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#0A894C" }}>
          <FileText size={24} className="inline mr-2" />
          Activity Reports
        </h1>
        <p className="text-gray-600">
          Search for activities and view student participation reports
        </p>
      </div>

      <Card
        style={{
          borderRadius: 8,
          border: "1px solid #e8f5e9",
          boxShadow: "0 2px 8px rgba(10, 137, 76, 0.08)",
          marginBottom: 24,
        }}
      >
        <SearchInput
          placeholder="Search by activity name, department, or major"
          allowClear
          enterButton={
            <Button
              type="primary"
              icon={<Search size={16} />}
              style={{
                backgroundColor: "#0A894C",
                borderColor: "#0A894C",
              }}
            >
              Search
            </Button>
          }
          size="large"
          onSearch={handleSearch}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>

      <Card
        style={{
          borderRadius: 8,
          border: "1px solid #e8f5e9",
          boxShadow: "0 2px 8px rgba(10, 137, 76, 0.08)",
        }}
      >
        <Table
          columns={activityColumns}
          dataSource={getFilteredActivities()}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} activities`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Student List Modal */}
      <Modal
        title={
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "#0A894C" }}>
              <User size={20} className="inline mr-2" />
              Student Participation List
            </h3>
            {selectedActivity && (
              <div className="mt-2 text-sm text-gray-600">
                <div className="font-medium text-base mb-1">
                  {selectedActivity.activityName}
                </div>
                <div className="flex flex-wrap gap-4">
                  <span>
                    <MapPin size={14} className="inline mr-1" />
                    {selectedActivity.location}
                  </span>
                  <span>
                    <Calendar size={14} className="inline mr-1" />
                    {selectedActivity.startDate} - {selectedActivity.endDate}
                  </span>
                  <span>
                    <Clock size={14} className="inline mr-1" />
                    {selectedActivity.activityHours} hours
                  </span>
                </div>
              </div>
            )}
          </div>
        }
        open={studentModalVisible}
        onCancel={() => setStudentModalVisible(false)}
        width={1200}
        footer={null}
        styles={{
          header: {
            borderBottom: "2px solid #0A894C",
            paddingBottom: 16,
          },
        }}
      >
        <div className="mt-4">
          <Table
            columns={studentColumns}
            dataSource={selectedActivity?.students || []}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </div>
      </Modal>
    </div>
  );
}

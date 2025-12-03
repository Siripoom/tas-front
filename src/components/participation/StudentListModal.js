"use client";

import { Modal, Tabs, Table, Button, Tag, Avatar, Input } from "antd";
import { CheckCircle, XCircle, Clock, User } from "lucide-react";
import { useState } from "react";

const { TextArea } = Input;

const StudentListModal = ({ visible, onClose, activity, onApprove, onReject }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [studentsToReject, setStudentsToReject] = useState([]);
  // Sample data - จะถูกแทนที่ด้วยข้อมูลจริงจาก API
  const students = {
    approved: [
      {
        id: 1,
        studentId: "6501101001",
        name: "สมชาย ใจดี",
        department: "คอมพิวเตอร์ศึกษา",
        major: "TCT",
        year: "3",
      },
      {
        id: 2,
        studentId: "6501101002",
        name: "สมหญิง รักเรียน",
        department: "คอมพิวเตอร์ศึกษา",
        major: "CED",
        year: "2",
      },
    ],
    pending: [
      {
        id: 3,
        studentId: "6501101003",
        name: "สมศักดิ์ มานะ",
        department: "คอมพิวเตอร์ศึกษา",
        major: "TCT",
        year: "4",
      },
    ],
    rejected: [
      {
        id: 4,
        studentId: "6501101004",
        name: "สมปอง ขยัน",
        department: "คอมพิวเตอร์ศึกษา",
        major: "CED",
        year: "1",
      },
    ],
  };

  const handleBulkApprove = () => {
    const selectedStudents = students.pending.filter((student) =>
      selectedRowKeys.includes(student.id)
    );
    selectedStudents.forEach((student) => onApprove(student));
    setSelectedRowKeys([]);
  };

  const handleRejectClick = (student = null) => {
    if (student) {
      setStudentsToReject([student]);
    } else {
      const selectedStudents = students.pending.filter((student) =>
        selectedRowKeys.includes(student.id)
      );
      setStudentsToReject(selectedStudents);
    }
    setRejectModalVisible(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      alert("กรุณาระบุเหตุผลในการไม่อนุมัติ");
      return;
    }
    studentsToReject.forEach((student) => {
      onReject({ ...student, rejectReason });
    });
    setRejectModalVisible(false);
    setRejectReason("");
    setStudentsToReject([]);
    setSelectedRowKeys([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "index",
      key: "index",
      width: 70,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "นักศึกษา",
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
      title: "ภาควิชา",
      dataIndex: "department",
      key: "department",
      width: 180,
    },
    {
      title: "สาขา",
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
      title: "ชั้นปี",
      dataIndex: "year",
      key: "year",
      width: 80,
      align: "center",
      render: (year) => `ปี ${year}`,
    },
  ];

  const approvedColumns = [...columns];

  const pendingColumns = [
    ...columns,
    {
      title: "การจัดการ",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="small"
            danger
            icon={<XCircle size={16} />}
            onClick={() => handleRejectClick(record)}
          >
            ไม่อนุมัติ
          </Button>
        </div>
      ),
    },
  ];

  const rejectedColumns = [...columns];

  const tabItems = [
    {
      key: "approved",
      label: (
        <span className="flex items-center gap-2">
          <CheckCircle size={16} />
          อนุมัติแล้ว ({students.approved.length})
        </span>
      ),
      children: (
        <Table
          columns={approvedColumns}
          dataSource={students.approved}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 600 }}
        />
      ),
    },
    {
      key: "pending",
      label: (
        <span className="flex items-center gap-2">
          <Clock size={16} />
          รออนุมัติ ({students.pending.length})
        </span>
      ),
      children: (
        <div>
          {selectedRowKeys.length > 0 && (
            <div className="mb-4 flex gap-2">
              <Button
                type="primary"
                icon={<CheckCircle size={16} />}
                onClick={handleBulkApprove}
                style={{
                  backgroundColor: "#0A894C",
                  borderColor: "#0A894C",
                }}
              >
                อนุมัติที่เลือก ({selectedRowKeys.length})
              </Button>
              <Button
                danger
                icon={<XCircle size={16} />}
                onClick={() => handleRejectClick()}
              >
                ไม่อนุมัติที่เลือก ({selectedRowKeys.length})
              </Button>
            </div>
          )}
          <Table
            columns={pendingColumns}
            dataSource={students.pending}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 600 }}
          />
        </div>
      ),
    },
    {
      key: "rejected",
      label: (
        <span className="flex items-center gap-2">
          <XCircle size={16} />
          ไม่อนุมัติ ({students.rejected.length})
        </span>
      ),
      children: (
        <Table
          columns={rejectedColumns}
          dataSource={students.rejected}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 600 }}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <div>
          <h3 className="text-lg font-semibold" style={{ color: "#0A894C" }}>
            รายการนักศึกษา
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {activity?.activityName || "กิจกรรม"}
          </p>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={null}
      styles={{
        header: {
          borderBottom: "2px solid #0A894C",
          paddingBottom: 16,
        },
      }}
    >
      <Tabs
        defaultActiveKey="approved"
        items={tabItems}
        className="custom-tabs"
      />
      <style jsx global>{`
        .custom-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #0A894C !important;
        }
        .custom-tabs .ant-tabs-ink-bar {
          background: #0A894C !important;
        }
        .custom-tabs .ant-tabs-tab:hover {
          color: #0A894C !important;
        }
      `}</style>

      {/* Rejection Reason Modal */}
      <Modal
        title="เหตุผลในการไม่อนุมัติ"
        open={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason("");
          setStudentsToReject([]);
        }}
        onOk={handleConfirmReject}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
        okButtonProps={{
          style: { backgroundColor: "#f5222d", borderColor: "#f5222d" },
        }}
      >
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            นักศึกษาที่จะไม่อนุมัติ: {studentsToReject.map((s) => s.name).join(", ")}
          </p>
          <TextArea
            rows={4}
            placeholder="กรุณาระบุเหตุผลในการไม่อนุมัติ..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
      </Modal>
    </Modal>
  );
};

export default StudentListModal;

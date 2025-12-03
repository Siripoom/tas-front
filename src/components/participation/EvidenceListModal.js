"use client";

import { Modal, Table, Button, Tag, Avatar, Image, Input } from "antd";
import { CheckCircle, XCircle, FileText, User, Eye } from "lucide-react";
import { useState } from "react";

const { TextArea } = Input;

const EvidenceListModal = ({ visible, onClose, activity, onApprove, onReject }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [studentsToReject, setStudentsToReject] = useState([]);

  // Sample data - students with uploaded evidence
  const studentsWithEvidence = [
    {
      id: 1,
      studentId: "6501101001",
      name: "John Doe",
      department: "Computer Education",
      major: "TCT",
      year: "3",
      evidenceUrl: "https://via.placeholder.com/400x300?text=Evidence+1",
      uploadDate: "2024-01-15",
      status: "pending", // pending, approved, rejected
    },
    {
      id: 2,
      studentId: "6501101002",
      name: "Jane Smith",
      department: "Computer Education",
      major: "CED",
      year: "2",
      evidenceUrl: "https://via.placeholder.com/400x300?text=Evidence+2",
      uploadDate: "2024-01-16",
      status: "pending",
    },
    {
      id: 3,
      studentId: "6501101003",
      name: "Bob Johnson",
      department: "Computer Education",
      major: "TCT",
      year: "4",
      evidenceUrl: "https://via.placeholder.com/400x300?text=Evidence+3",
      uploadDate: "2024-01-14",
      status: "approved",
    },
  ];

  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  const handleBulkApprove = () => {
    const selectedStudents = studentsWithEvidence.filter(
      (student) => selectedRowKeys.includes(student.id) && student.status === "pending"
    );
    selectedStudents.forEach((student) => onApprove(student));
    setSelectedRowKeys([]);
  };

  const handleRejectClick = (student = null) => {
    if (student) {
      setStudentsToReject([student]);
    } else {
      const selectedStudents = studentsWithEvidence.filter(
        (student) => selectedRowKeys.includes(student.id) && student.status === "pending"
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
    getCheckboxProps: (record) => ({
      disabled: record.status !== "pending",
    }),
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      width: 70,
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
      title: "Upload Date",
      dataIndex: "uploadDate",
      key: "uploadDate",
      width: 120,
      align: "center",
    },
    {
      title: "Evidence",
      dataIndex: "evidenceUrl",
      key: "evidenceUrl",
      width: 100,
      align: "center",
      render: (url) => (
        <Button
          size="small"
          icon={<Eye size={16} />}
          onClick={() => handlePreview(url)}
          style={{
            backgroundColor: "#0A894C",
            borderColor: "#0A894C",
            color: "#ffffff",
          }}
        >
          View
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => {
        const statusConfig = {
          pending: { color: "#fa8c16", text: "Pending" },
          approved: { color: "#0A894C", text: "Approved" },
          rejected: { color: "#f5222d", text: "Rejected" },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
          <Tag color={config.color} style={{ borderRadius: 8, fontWeight: 500 }}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          {record.status === "pending" ? (
            <Button
              size="small"
              danger
              icon={<XCircle size={16} />}
              onClick={() => handleRejectClick(record)}
            >
              Reject
            </Button>
          ) : (
            <span className="text-xs text-gray-500">
              {record.status === "approved" ? "Already approved" : "Already rejected"}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "#0A894C" }}>
              <FileText size={20} className="inline mr-2" />
              Evidence Review
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {activity?.activityName || "Activity"}
            </p>
          </div>
        }
        open={visible}
        onCancel={onClose}
        width={1100}
        footer={null}
        styles={{
          header: {
            borderBottom: "2px solid #0A894C",
            paddingBottom: 16,
          },
        }}
      >
        <div className="mt-4">
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
                Approve Selected ({selectedRowKeys.length})
              </Button>
              <Button
                danger
                icon={<XCircle size={16} />}
                onClick={() => handleRejectClick()}
              >
                Reject Selected ({selectedRowKeys.length})
              </Button>
            </div>
          )}
          <Table
            columns={columns}
            dataSource={studentsWithEvidence}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 900 }}
          />
        </div>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title="Evidence Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={600}
      >
        <Image
          src={previewImage}
          alt="Evidence"
          style={{ width: "100%" }}
          preview={false}
        />
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal
        title="Rejection Reason"
        open={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason("");
          setStudentsToReject([]);
        }}
        onOk={handleConfirmReject}
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{
          style: { backgroundColor: "#f5222d", borderColor: "#f5222d" },
        }}
      >
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Students to reject: {studentsToReject.map((s) => s.name).join(", ")}
          </p>
          <TextArea
            rows={4}
            placeholder="Please provide a reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};

export default EvidenceListModal;

"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Input,
  Select,
  Tag,
  Button,
  Modal,
  Upload,
  message,
  Space,
  Alert,
} from "antd";
import {
  Search,
  Upload as UploadIcon,
  Eye,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  Download,
} from "lucide-react";

const { Search: SearchInput } = Input;
const { Option } = Select;

export default function StudentParticipationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [evidenceModalVisible, setEvidenceModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Mock data for student's activities
  const mockActivities = [
    {
      id: 1,
      name: "AI Technology Lecture",
      category: "Academic Activity",
      date: "15 Jan 2025",
      time: "13:00 - 16:00",
      location: "Room A301",
      hours: 3,
      status: "approved",
      evidenceStatus: "approved",
      evidenceUrl: "/evidence/activity1.pdf",
      approvedDate: "10 Jan 2025",
    },
    {
      id: 2,
      name: "Community Development",
      category: "Volunteer Activity",
      date: "20 Jan 2025",
      time: "09:00 - 15:00",
      location: "Suan Dok Community",
      hours: 6,
      status: "approved",
      evidenceStatus: "pending",
      evidenceUrl: "/evidence/activity2.pdf",
      approvedDate: "15 Jan 2025",
    },
    {
      id: 3,
      name: "Internal Sports Competition",
      category: "Sports Activity",
      date: "25 Jan 2025",
      time: "08:00 - 17:00",
      location: "Main Stadium",
      hours: 8,
      status: "approved",
      evidenceStatus: "rejected",
      evidenceUrl: null,
      rejectionReason: "Photo is not clear. Please upload a clearer image.",
      approvedDate: "18 Jan 2025",
    },
    {
      id: 4,
      name: "Thai Art Event",
      category: "Art and Culture",
      date: "1 Feb 2025",
      time: "10:00 - 16:00",
      location: "Main Hall",
      hours: 6,
      status: "pending",
      evidenceStatus: null,
      evidenceUrl: null,
      requestDate: "28 Dec 2024",
    },
    {
      id: 5,
      name: "Buddhist Merit Making",
      category: "Religious Activity",
      date: "5 Feb 2025",
      time: "07:00 - 09:00",
      location: "Building 1",
      hours: 2,
      status: "rejected",
      evidenceStatus: null,
      evidenceUrl: null,
      rejectionReason: "Activity quota is full.",
      rejectedDate: "2 Jan 2025",
    },
    {
      id: 6,
      name: "Plant Visit",
      category: "Study Tour",
      date: "10 Feb 2025",
      time: "08:00 - 17:00",
      location: "Rayong",
      hours: 8,
      status: "approved",
      evidenceStatus: null,
      evidenceUrl: null,
      approvedDate: "3 Jan 2025",
    },
  ];

  const getFilteredActivities = () => {
    let filtered = [...mockActivities];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((activity) =>
        activity.name.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((activity) => activity.status === statusFilter);
    }

    return filtered;
  };

  const getStatusTag = (status) => {
    const config = {
      approved: { color: "green", icon: <CheckCircle size={14} />, text: "Approved" },
      pending: { color: "orange", icon: <Clock size={14} />, text: "Pending" },
      rejected: { color: "red", icon: <XCircle size={14} />, text: "Rejected" },
    };
    const c = config[status] || config.pending;
    return (
      <Tag color={c.color}>
        <span className="flex items-center gap-1">
          {c.icon}
          {c.text}
        </span>
      </Tag>
    );
  };

  const getEvidenceStatusTag = (status) => {
    if (!status) return <Tag>No Evidence</Tag>;
    const config = {
      approved: { color: "green", icon: <CheckCircle size={14} />, text: "Evidence Approved" },
      pending: { color: "orange", icon: <Clock size={14} />, text: "Under Review" },
      rejected: { color: "red", icon: <XCircle size={14} />, text: "Evidence Rejected" },
    };
    const c = config[status];
    return (
      <Tag color={c.color}>
        <span className="flex items-center gap-1">
          {c.icon}
          {c.text}
        </span>
      </Tag>
    );
  };

  const handleViewDetails = (record) => {
    setSelectedActivity(record);
    setDetailModalVisible(true);
  };

  const handleUploadEvidence = (record) => {
    setSelectedActivity(record);
    setEvidenceModalVisible(true);
    setUploadedFile(null);
  };

  const handleReapply = (record) => {
    Modal.confirm({
      title: "Confirm Re-application",
      content: `Do you want to re-apply for "${record.name}"?`,
      okText: "Confirm",
      cancelText: "Cancel",
      okButtonProps: { style: { backgroundColor: "#0A894C", borderColor: "#0A894C" } },
      onOk: () => {
        message.success(`Re-application submitted successfully`);
      },
    });
  };

  const handleDownloadEvidence = (record) => {
    if (record.evidenceUrl) {
      // In production, this would download the actual file
      message.success(`Downloading evidence for "${record.name}"`);
      // Simulate download
      const link = document.createElement("a");
      link.href = record.evidenceUrl;
      link.download = `${record.name}_evidence.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      message.error("No evidence file available");
    }
  };

  const handleFileUpload = (info) => {
    const { status } = info.file;
    if (status === "done") {
      setUploadedFile(info.file);
      message.success(`${info.file.name} uploaded successfully`);
    } else if (status === "error") {
      message.error(`${info.file.name} upload failed`);
    }
  };

  const handleSubmitEvidence = () => {
    if (!uploadedFile) {
      message.error("Please upload evidence file");
      return;
    }
    message.success("Evidence submitted successfully");
    setEvidenceModalVisible(false);
    setSelectedActivity(null);
    setUploadedFile(null);
  };

  const columns = [
    {
      title: "Activity Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-800">{text}</div>
          <div className="text-xs text-gray-500">{record.category}</div>
        </div>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      width: "20%",
      render: (text, record) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 mb-1">
            <Calendar size={14} className="text-gray-500" />
            <span>{text}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-gray-500" />
            <span className="text-gray-600">{record.time}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Hours",
      dataIndex: "hours",
      key: "hours",
      width: "10%",
      align: "center",
      render: (hours) => (
        <Tag color="blue" className="font-semibold">{hours} hrs</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Evidence",
      dataIndex: "evidenceStatus",
      key: "evidenceStatus",
      width: "15%",
      render: (status) => getEvidenceStatusTag(status),
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<Eye size={16} />}
            onClick={() => handleViewDetails(record)}
            style={{ color: "#0A894C", padding: 0 }}
          />
          {record.status === "approved" && (
            <Button
              type="link"
              icon={<UploadIcon size={16} />}
              onClick={() => handleUploadEvidence(record)}
              style={{ color: "#0A894C", padding: 0 }}
            />
          )}
          {record.status === "approved" && record.evidenceStatus === "approved" && (
            <Button
              type="link"
              icon={<Download size={16} />}
              onClick={() => handleDownloadEvidence(record)}
              style={{ color: "#3b82f6", padding: 0 }}
            />
          )}
          {record.status === "rejected" && (
            <Button
              type="link"
              icon={<RefreshCw size={16} />}
              onClick={() => handleReapply(record)}
              style={{ color: "#f59e0b", padding: 0 }}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header Banner */}
      <Card
        className="mb-6 md:mb-8 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #0A894C 0%, #0ea258 100%)",
          border: "none",
        }}
      >
        <div className="text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-2">My Activities</h2>
          <p className="text-xs md:text-sm opacity-90">
            Track your participation and upload evidence
          </p>
        </div>
      </Card>

      {/* Search and Filter Section */}
      <Card className="mb-6 md:mb-8" style={{ borderRadius: 12 }}>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center">
          <div className="flex-1 min-w-0">
            <SearchInput
              placeholder="Search activities..."
              allowClear
              size="large"
              prefix={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              placeholder="Filter by status"
              allowClear
              size="large"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
            >
              <Option value="approved">Approved</Option>
              <Option value="pending">Pending</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Activities Table */}
      <Card style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
        <Table
          columns={columns}
          dataSource={getFilteredActivities()}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} activities`,
            simple: window.innerWidth < 768
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={<div className="flex items-center gap-2"><FileText size={20} style={{ color: "#0A894C" }} /><span className="text-base md:text-lg">Activity Details</span></div>}
        open={detailModalVisible}
        onCancel={() => { setDetailModalVisible(false); setSelectedActivity(null); }}
        footer={null}
        width={window.innerWidth < 768 ? "95%" : 600}
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        {selectedActivity && (
          <div className="py-4">
            <h3 className="text-xl font-bold mb-4">{selectedActivity.name}</h3>
            <div className="space-y-4">
              <div><Tag color="green">{selectedActivity.category}</Tag></div>
              <div className="flex items-center gap-2"><Calendar size={18} /><span><strong>Date:</strong> {selectedActivity.date}</span></div>
              <div className="flex items-center gap-2"><Clock size={18} /><span><strong>Time:</strong> {selectedActivity.time} ({selectedActivity.hours} hours)</span></div>
              <div className="flex items-center gap-2"><MapPin size={18} /><span><strong>Location:</strong> {selectedActivity.location}</span></div>
              <div className="border-t pt-4">
                <div className="mb-2"><strong>Status:</strong> {getStatusTag(selectedActivity.status)}</div>
                {selectedActivity.status === "rejected" && (
                  <Alert message="Rejected" description={selectedActivity.rejectionReason} type="error" showIcon icon={<XCircle size={16} />} />
                )}
              </div>
              {selectedActivity.status === "approved" && (
                <div className="border-t pt-4">
                  <div className="mb-2"><strong>Evidence:</strong> {getEvidenceStatusTag(selectedActivity.evidenceStatus)}</div>
                  {selectedActivity.evidenceStatus === "rejected" && (
                    <Alert message="Evidence Rejected" description={selectedActivity.rejectionReason} type="warning" showIcon icon={<AlertCircle size={16} />} />
                  )}
                  {selectedActivity.evidenceStatus === "approved" && selectedActivity.evidenceUrl && (
                    <Button
                      type="primary"
                      icon={<Download size={16} />}
                      onClick={() => handleDownloadEvidence(selectedActivity)}
                      className="mt-2"
                      style={{ backgroundColor: "#3b82f6", borderColor: "#3b82f6" }}
                    >
                      Download Evidence Certificate
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={<div className="flex items-center gap-2"><UploadIcon size={20} style={{ color: "#0A894C" }} /><span className="text-base md:text-lg">Upload Evidence</span></div>}
        open={evidenceModalVisible}
        onOk={handleSubmitEvidence}
        onCancel={() => { setEvidenceModalVisible(false); setSelectedActivity(null); setUploadedFile(null); }}
        okText="Submit"
        okButtonProps={{ style: { backgroundColor: "#0A894C", borderColor: "#0A894C" } }}
        width={window.innerWidth < 768 ? "95%" : 600}
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        {selectedActivity && (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">{selectedActivity.name}</h3>
            {selectedActivity.evidenceStatus === "rejected" && (
              <Alert message="Previous Rejected" description={selectedActivity.rejectionReason} type="warning" showIcon className="mb-4" />
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Upload PDF Evidence</label>
              <Upload.Dragger name="file" accept=".pdf" maxCount={1} onChange={handleFileUpload} beforeUpload={() => false}>
                <p className="ant-upload-drag-icon"><UploadIcon size={48} style={{ color: "#0A894C" }} /></p>
                <p className="ant-upload-text">Click or drag PDF to upload</p>
                <p className="ant-upload-hint">Upload clear evidence in PDF format</p>
              </Upload.Dragger>
            </div>
            {uploadedFile && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <FileText size={16} /><span><strong>Ready:</strong> {uploadedFile.name}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

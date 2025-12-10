"use client";

import { useState, useEffect } from "react";
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
  Spin,
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
import { getAttendancesByUser } from "@/services/attendance";
import { uploadFile, getFilesByActivity } from "@/services/file";

const { Search: SearchInput } = Input;
const { Option } = Select;

export default function StudentParticipationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [evidenceModalVisible, setEvidenceModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserInfo(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Fetch student's activities
  useEffect(() => {
    const fetchActivities = async () => {
      if (!userInfo?.id) return;

      try {
        setLoading(true);
        const attendances = await getAttendancesByUser(userInfo.id);

        // Transform data
        const transformedData = await Promise.all(
          attendances.map(async (attendance) => {
            const activity = attendance.activity;

            // Fetch files for this activity
            let evidenceFiles = [];
            try {
              evidenceFiles = await getFilesByActivity(activity.id);
            } catch (error) {
              console.error("Error fetching files:", error);
            }

            return {
              id: attendance.id,
              activityId: activity.id,
              name: activity.name,
              category: activity.typeActivity?.name || "ไม่ระบุประเภท",
              date: new Date(activity.date).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              time:
                activity.startDate && activity.endDate
                  ? `${new Date(activity.startDate).toLocaleTimeString(
                      "th-TH",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )} - ${new Date(activity.endDate).toLocaleTimeString(
                      "th-TH",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}`
                  : "ไม่ระบุเวลา",
              location: activity.address || "ไม่ระบุสถานที่",
              hours: activity.hour || 0,
              status: attendance.status, // joined, accepted, rejected, Inprogress, completed, uncompleted
              evidenceStatus: evidenceFiles.length > 0 ? "uploaded" : null,
              evidenceFiles: evidenceFiles,
              reason: attendance.reason,
              createdAt: attendance.createdAt,
            };
          })
        );

        setActivities(transformedData);
      } catch (error) {
        console.error("Error fetching activities:", error);
        message.error("ไม่สามารถโหลดข้อมูลกิจกรรมได้");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userInfo]);

  const refreshActivities = async () => {
    if (!userInfo?.id) return;

    try {
      setLoading(true);
      const attendances = await getAttendancesByUser(userInfo.id);

      const transformedData = await Promise.all(
        attendances.map(async (attendance) => {
          const activity = attendance.activity;

          let evidenceFiles = [];
          try {
            evidenceFiles = await getFilesByActivity(activity.id);
          } catch (error) {
            console.error("Error fetching files:", error);
          }

          return {
            id: attendance.id,
            activityId: activity.id,
            name: activity.name,
            category: activity.typeActivity?.name || "ไม่ระบุประเภท",
            date: new Date(activity.date).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            time:
              activity.startDate && activity.endDate
                ? `${new Date(activity.startDate).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${new Date(activity.endDate).toLocaleTimeString(
                    "th-TH",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}`
                : "ไม่ระบุเวลา",
            location: activity.address || "ไม่ระบุสถานที่",
            hours: activity.hour || 0,
            status: attendance.status,
            evidenceStatus: evidenceFiles.length > 0 ? "uploaded" : null,
            evidenceFiles: evidenceFiles,
            reason: attendance.reason,
            createdAt: attendance.createdAt,
          };
        })
      );

      setActivities(transformedData);
    } catch (error) {
      console.error("Error fetching activities:", error);
      message.error("ไม่สามารถโหลดข้อมูลกิจกรรมได้");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredActivities = () => {
    let filtered = [...activities];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((activity) =>
        activity.name.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (activity) => activity.status === statusFilter
      );
    }

    return filtered;
  };

  const getStatusTag = (status) => {
    const config = {
      joined: { color: "blue", icon: <Clock size={14} />, text: "เข้าร่วม" },
      accepted: {
        color: "green",
        icon: <CheckCircle size={14} />,
        text: "อนุมัติ",
      },
      rejected: {
        color: "red",
        icon: <XCircle size={14} />,
        text: "ไม่อนุมัติ",
      },
      Inprogress: {
        color: "orange",
        icon: <Clock size={14} />,
        text: "กำลังดำเนินการ",
      },
      completed: {
        color: "green",
        icon: <CheckCircle size={14} />,
        text: "เสร็จสิ้น",
      },
      uncompleted: {
        color: "red",
        icon: <XCircle size={14} />,
        text: "ไม่สำเร็จ",
      },
    };
    const c = config[status] || config.joined;
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
    if (!status) return <Tag>ยังไม่ได้อัพโหลด</Tag>;
    const config = {
      uploaded: {
        color: "blue",
        icon: <FileText size={14} />,
        text: "อัพโหลดแล้ว",
      },
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

  const handleFileUpload = async (info) => {
    const { file, onSuccess, onError } = info;

    if (!selectedActivity?.activityId) {
      message.error("ไม่พบข้อมูลกิจกรรม");
      onError("No activity selected");
      return;
    }

    try {
      setUploading(true);
      await uploadFile(file, selectedActivity.activityId);
      setUploadedFile(file);
      message.success(`${file.name} อัพโหลดสำเร็จ`);
      onSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error(`${file.name} อัพโหลดไม่สำเร็จ`);
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitEvidence = async () => {
    if (!uploadedFile) {
      message.warning("กรุณาเลือกไฟล์หลักฐาน");
      return;
    }

    try {
      message.success("อัพโหลดหลักฐานสำเร็จ");
      setEvidenceModalVisible(false);
      setUploadedFile(null);

      // Refresh activities
      await refreshActivities();
    } catch (error) {
      console.error("Error submitting evidence:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกหลักฐาน");
    }
  };

  const columns = [
    {
      title: "ชื่อกิจกรรม",
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
      title: "วันที่และเวลา",
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
      title: "ชั่วโมง",
      dataIndex: "hours",
      key: "hours",
      width: "10%",
      align: "center",
      render: (hours) => (
        <Tag color="blue" className="font-semibold">
          {hours} ชม.
        </Tag>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => getStatusTag(status),
    },
    {
      title: "หลักฐาน",
      dataIndex: "evidenceStatus",
      key: "evidenceStatus",
      width: "15%",
      render: (status) => getEvidenceStatusTag(status),
    },
    {
      title: "การจัดการ",
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
            title="ดูรายละเอียด"
          />
          {(record.status === "accepted" || record.status === "completed") && (
            <Button
              type="link"
              icon={<UploadIcon size={16} />}
              onClick={() => handleUploadEvidence(record)}
              style={{ color: "#0A894C", padding: 0 }}
              title="อัพโหลดหลักฐาน"
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
              placeholder="ค้นหากิจกรรม..."
              allowClear
              size="large"
              prefix={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              placeholder="กรองตามสถานะ"
              allowClear
              size="large"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
            >
              <Option value="joined">เข้าร่วม</Option>
              <Option value="accepted">อนุมัติ</Option>
              <Option value="rejected">ไม่อนุมัติ</Option>
              <Option value="Inprogress">กำลังดำเนินการ</Option>
              <Option value="completed">เสร็จสิ้น</Option>
              <Option value="uncompleted">ไม่สำเร็จ</Option>
            </Select>
          </div>
          <div>
            <Button
              icon={<RefreshCw size={18} />}
              size="large"
              onClick={refreshActivities}
              loading={loading}
            >
              รีเฟรช
            </Button>
          </div>
        </div>
      </Card>

      {/* Activities Table */}
      <Card
        style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}
      >
        <Table
          columns={columns}
          dataSource={getFilteredActivities()}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `ทั้งหมด ${total} กิจกรรม`,
            simple: typeof window !== "undefined" && window.innerWidth < 768,
          }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: loading ? <Spin /> : "ไม่พบข้อมูลกิจกรรม",
          }}
        />
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileText size={20} style={{ color: "#0A894C" }} />
            <span className="text-base md:text-lg">Activity Details</span>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedActivity(null);
        }}
        footer={null}
        width={window.innerWidth < 768 ? "95%" : 600}
        styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
      >
        {selectedActivity && (
          <div className="py-4">
            <h3 className="text-xl font-bold mb-4">{selectedActivity.name}</h3>
            <div className="space-y-4">
              <div>
                <Tag color="green">{selectedActivity.category}</Tag>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>
                  <strong>Date:</strong> {selectedActivity.date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>
                  <strong>Time:</strong> {selectedActivity.time} (
                  {selectedActivity.hours} hours)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>
                  <strong>Location:</strong> {selectedActivity.location}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  {getStatusTag(selectedActivity.status)}
                </div>
                {selectedActivity.status === "rejected" && (
                  <Alert
                    message="Rejected"
                    description={selectedActivity.rejectionReason}
                    type="error"
                    showIcon
                    icon={<XCircle size={16} />}
                  />
                )}
              </div>
              {selectedActivity.status === "approved" && (
                <div className="border-t pt-4">
                  <div className="mb-2">
                    <strong>Evidence:</strong>{" "}
                    {getEvidenceStatusTag(selectedActivity.evidenceStatus)}
                  </div>
                  {selectedActivity.evidenceStatus === "rejected" && (
                    <Alert
                      message="Evidence Rejected"
                      description={selectedActivity.rejectionReason}
                      type="warning"
                      showIcon
                      icon={<AlertCircle size={16} />}
                    />
                  )}
                  {selectedActivity.evidenceStatus === "approved" &&
                    selectedActivity.evidenceUrl && (
                      <Button
                        type="primary"
                        icon={<Download size={16} />}
                        onClick={() => handleDownloadEvidence(selectedActivity)}
                        className="mt-2"
                        style={{
                          backgroundColor: "#3b82f6",
                          borderColor: "#3b82f6",
                        }}
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
        title={
          <div className="flex items-center gap-2">
            <UploadIcon size={20} style={{ color: "#0A894C" }} />
            <span className="text-base md:text-lg">อัพโหลดหลักฐาน</span>
          </div>
        }
        open={evidenceModalVisible}
        onOk={handleSubmitEvidence}
        onCancel={() => {
          setEvidenceModalVisible(false);
          setSelectedActivity(null);
          setUploadedFile(null);
        }}
        okText="บันทึก"
        cancelText="ยกเลิก"
        confirmLoading={uploading}
        okButtonProps={{
          style: { backgroundColor: "#0A894C", borderColor: "#0A894C" },
        }}
        width={
          typeof window !== "undefined" && window.innerWidth < 768 ? "95%" : 600
        }
        styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
      >
        {selectedActivity && (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedActivity.name}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                อัพโหลดไฟล์หลักฐาน (PDF, รูปภาพ)
              </label>
              <Upload.Dragger
                name="file"
                accept=".pdf,.jpg,.jpeg,.png"
                maxCount={1}
                customRequest={handleFileUpload}
                showUploadList={true}
              >
                <p className="ant-upload-drag-icon flex justify-center">
                  <UploadIcon size={48} style={{ color: "#0A894C" }} />
                </p>
                <p className="ant-upload-text">
                  คลิกหรือลากไฟล์มาที่นี่เพื่ออัพโหลด
                </p>
                <p className="ant-upload-hint">
                  รองรับไฟล์ PDF หรือรูปภาพ (JPG, PNG)
                </p>
              </Upload.Dragger>
            </div>
            {selectedActivity.evidenceFiles &&
              selectedActivity.evidenceFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">ไฟล์ที่อัพโหลดแล้ว:</h4>
                  <div className="space-y-2">
                    {selectedActivity.evidenceFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <p className="text-sm text-gray-800 flex items-center gap-2">
                          <FileText size={16} />
                          <span>{file.fileName || file.fileUrl}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
}

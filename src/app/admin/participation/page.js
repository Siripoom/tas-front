"use client";

import { useState, useEffect } from "react";
import { Tabs, Card, message, Spin } from "antd";
import { Users, FileCheck } from "lucide-react";
import SearchFilterBar from "@/components/participation/SearchFilterBar";
import ParticipationTable from "@/components/participation/ParticipationTable";
import StudentListModal from "@/components/participation/StudentListModal";
import EvidenceListModal from "@/components/participation/EvidenceListModal";
import { getAllActivities } from "@/services/activity";
import { getAllAttendances, updateAttendance } from "@/services/attendance";

export default function ParticipationPage() {
  const [activeTab, setActiveTab] = useState("participation");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    department: null,
    major: null,
    year: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [evidenceModalVisible, setEvidenceModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [attendances, setAttendances] = useState([]);

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [activitiesData, attendancesData] = await Promise.all([
        getAllActivities(),
        getAllAttendances(),
      ]);

      setActivities(activitiesData);
      setAttendances(attendancesData);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลการเข้าร่วมได้");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get activities with attendance counts
  const getActivitiesWithAttendances = () => {
    return activities.map((activity) => {
      // Count attendances for this activity
      const activityAttendances = attendances.filter(
        (att) => att.activityId === activity.id
      );

      // For participation tab - count joined/accepted/Inprogress
      const participationCount = activityAttendances.filter(
        (att) => ["joined", "accepted", "Inprogress"].includes(att.status)
      ).length;

      // For evidence tab - count completed
      const evidenceCount = activityAttendances.filter(
        (att) => ["completed", "uncompleted"].includes(att.status)
      ).length;

      return {
        ...activity,
        participationCount,
        evidenceCount,
        attendances: activityAttendances,
      };
    });
  };

  // Filter and search data
  const getFilteredData = () => {
    let filtered = getActivitiesWithAttendances();

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.department?.name?.toLowerCase().includes(query)
      );
    }

    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter((item) => item.department?.name === filters.department);
    }

    // Apply major filter
    if (filters.major) {
      filtered = filtered.filter((item) =>
        item.majorJoins?.some((mj) => mj.major?.name === filters.major)
      );
    }

    // Apply year filter
    if (filters.year) {
      filtered = filtered.filter((item) => item.level === `ปี ${filters.year}`);
    }

    return filtered;
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleReset = () => {
    setSearchQuery("");
    setFilters({
      department: null,
      major: null,
      year: null,
    });
    message.success("Reset filters successfully");
  };

  const handleView = (record) => {
    setSelectedActivity(record);
    setModalVisible(true);
  };

  const handleViewEvidence = (record) => {
    setSelectedActivity(record);
    setEvidenceModalVisible(true);
  };

  const handleEdit = (record) => {
    message.info(`Edit activity: ${record.activityName}`);
  };

  const handleDelete = (record) => {
    message.success(`Deleted activity: ${record.activityName}`);
  };

  const handleApprove = async (attendance) => {
    try {
      await updateAttendance(attendance.id, { status: "accepted" });
      message.success(`อนุมัติการเข้าร่วมสำเร็จ`);
      fetchData(); // Refresh data
    } catch (error) {
      message.error("ไม่สามารถอนุมัติการเข้าร่วมได้");
      console.error("Error approving attendance:", error);
    }
  };

  const handleReject = async (attendance) => {
    try {
      await updateAttendance(attendance.id, { status: "rejected" });
      message.error(`ปฏิเสธการเข้าร่วมสำเร็จ`);
      fetchData(); // Refresh data
    } catch (error) {
      message.error("ไม่สามารถปฏิเสธการเข้าร่วมได้");
      console.error("Error rejecting attendance:", error);
    }
  };

  const handleApproveEvidence = async (attendance) => {
    try {
      await updateAttendance(attendance.id, { status: "completed" });
      message.success(`อนุมัติหลักฐานสำเร็จ`);
      fetchData(); // Refresh data
    } catch (error) {
      message.error("ไม่สามารถอนุมัติหลักฐานได้");
      console.error("Error approving evidence:", error);
    }
  };

  const handleRejectEvidence = async (attendance) => {
    try {
      await updateAttendance(attendance.id, { status: "uncompleted" });
      message.error(`ปฏิเสธหลักฐานสำเร็จ`);
      fetchData(); // Refresh data
    } catch (error) {
      message.error("ไม่สามารถปฏิเสธหลักฐานได้");
      console.error("Error rejecting evidence:", error);
    }
  };

  const tabItems = [
    {
      key: "participation",
      label: (
        <span className="flex items-center gap-2">
          <Users size={18} />
          Event Participation
        </span>
      ),
      children: (
        <div>
          <SearchFilterBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
          <Card
            style={{
              borderRadius: 8,
              border: "1px solid #e8f5e9",
              boxShadow: "0 2px 8px rgba(10, 137, 76, 0.08)",
            }}
          >
            <Spin spinning={loading}>
              <ParticipationTable
                data={getFilteredData()}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showParticipationCount={true}
              />
            </Spin>
          </Card>
        </div>
      ),
    },
    {
      key: "evidence",
      label: (
        <span className="flex items-center gap-2">
          <FileCheck size={18} />
          Participation Evidence
        </span>
      ),
      children: (
        <div>
          <SearchFilterBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
          <Card
            style={{
              borderRadius: 8,
              border: "1px solid #e8f5e9",
              boxShadow: "0 2px 8px rgba(10, 137, 76, 0.08)",
            }}
          >
            <Spin spinning={loading}>
              <ParticipationTable
                data={getFilteredData()}
                onView={handleViewEvidence}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showEvidenceCount={true}
              />
            </Spin>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        className="custom-main-tabs"
      />

      <StudentListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        activity={selectedActivity}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <EvidenceListModal
        visible={evidenceModalVisible}
        onClose={() => setEvidenceModalVisible(false)}
        activity={selectedActivity}
        onApprove={handleApproveEvidence}
        onReject={handleRejectEvidence}
      />

      <style jsx global>{`
        .custom-main-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #0A894C !important;
          font-weight: 600 !important;
        }
        .custom-main-tabs .ant-tabs-ink-bar {
          background: #0A894C !important;
          height: 3px !important;
        }
        .custom-main-tabs .ant-tabs-tab:hover {
          color: #0A894C !important;
        }
        .custom-main-tabs .ant-tabs-nav {
          margin-bottom: 24px !important;
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Tabs, Card, message } from "antd";
import { Users, FileCheck } from "lucide-react";
import SearchFilterBar from "@/components/participation/SearchFilterBar";
import ParticipationTable from "@/components/participation/ParticipationTable";
import StudentListModal from "@/components/participation/StudentListModal";
import EvidenceListModal from "@/components/participation/EvidenceListModal";

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

  const mockData = [
    {
      id: 1,
      activityName: "Community Service Project",
      department: "Computer Education",
      major: "TCT",
      studentCount: 15,
      maxStudents: 30,
    },
    {
      id: 2,
      activityName: "Technology Training Workshop",
      department: "Electrical Engineering",
      major: "CED",
      studentCount: 28,
      maxStudents: 30,
    },
    {
      id: 3,
      activityName: "Programming Skills Development",
      department: "Computer Education",
      major: "TCT",
      studentCount: 10,
      maxStudents: 25,
    },
    {
      id: 4,
      activityName: "Civil Engineering Workshop",
      department: "Civil Engineering Education",
      major: "CED",
      studentCount: 20,
      maxStudents: 35,
    },
    {
      id: 5,
      activityName: "Mechanical Skills Training",
      department: "Mechanical Engineering Education",
      major: "TCT",
      studentCount: 18,
      maxStudents: 30,
    },
    {
      id: 6,
      activityName: "IT Management Seminar",
      department: "Information Technology Education",
      major: "CED",
      studentCount: 25,
      maxStudents: 40,
    },
  ];

  // Filter and search data
  const getFilteredData = () => {
    let filtered = [...mockData];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.activityName.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.major.toLowerCase().includes(query)
      );
    }

    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter((item) => item.department === filters.department);
    }

    // Apply major filter
    if (filters.major) {
      filtered = filtered.filter((item) => item.major === filters.major);
    }

    // Apply year filter (if needed in the future)
    if (filters.year) {
      // Can be implemented when student data includes year
      // filtered = filtered.filter((item) => item.year === filters.year);
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

  const handleApprove = (student) => {
    message.success(`Approved ${student.name}`);
  };

  const handleReject = (student) => {
    message.error(`Rejected ${student.name}`);
  };

  const handleApproveEvidence = (student) => {
    message.success(`Evidence approved for ${student.name}`);
  };

  const handleRejectEvidence = (student) => {
    message.error(`Evidence rejected for ${student.name}`);
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
            <ParticipationTable
              data={getFilteredData()}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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
            <ParticipationTable
              data={getFilteredData()}
              onView={handleViewEvidence}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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

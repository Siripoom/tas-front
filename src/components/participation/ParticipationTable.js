"use client";

import { Table, Button, Tag } from "antd";
import { Eye } from "lucide-react";

const ParticipationTable = ({
  data,
  onView,
  showParticipationCount = false,
  showEvidenceCount = false
}) => {
  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "index",
      key: "index",
      width: 80,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "กิจกรรม",
      key: "activityName",
      ellipsis: true,
      render: (_, record) => record.name || record.activityName,
    },
    {
      title: "ภาควิชา",
      key: "department",
      width: 180,
      render: (_, record) => record.department?.name || record.department || "-",
    },
    {
      title: "สาขาวิชา",
      key: "major",
      width: 150,
      align: "center",
      render: (_, record) => {
        // Handle API data with majorJoins
        if (record.majorJoins && record.majorJoins.length > 0) {
          return (
            <div className="flex flex-wrap gap-1 justify-center">
              {record.majorJoins.map((mj, idx) => (
                <Tag
                  key={idx}
                  color="#0A894C"
                  style={{
                    borderRadius: 8,
                    fontWeight: 500,
                  }}
                >
                  {mj.major?.name}
                </Tag>
              ))}
            </div>
          );
        }
        // Handle mock data
        if (record.major) {
          return (
            <Tag
              color="#0A894C"
              style={{
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              {record.major}
            </Tag>
          );
        }
        return <span className="text-gray-400">ทุกสาขา</span>;
      },
    },
    {
      title: showParticipationCount ? "จำนวนผู้เข้าร่วม" : showEvidenceCount ? "จำนวนส่งหลักฐาน" : "จำนวนนักศึกษา",
      key: "studentCount",
      width: 150,
      align: "center",
      render: (_, record) => {
        // Determine which count to show
        let count, max;

        if (showParticipationCount) {
          count = record.participationCount || 0;
          max = record.maxPeopleCount || record.maxStudents || 0;
        } else if (showEvidenceCount) {
          count = record.evidenceCount || 0;
          max = record.maxPeopleCount || record.maxStudents || 0;
        } else {
          count = record.studentCount || record.peopleCount || 0;
          max = record.maxStudents || record.maxPeopleCount || 0;
        }

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
      title: "การจัดการ",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button
            type="text"
            icon={<Eye size={18} />}
            onClick={() => onView(record)}
            style={{ color: "#0A894C" }}
            title="ดูรายละเอียด"
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `ทั้งหมด ${total} รายการ`,
      }}
      scroll={{ x: 800 }}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 8,
      }}
    />
  );
};

export default ParticipationTable;

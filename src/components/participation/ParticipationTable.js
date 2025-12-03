"use client";

import { Table, Button, Popconfirm, Tag } from "antd";
import { Eye, Edit, Trash2 } from "lucide-react";

const ParticipationTable = ({ data, onView, onEdit, onDelete }) => {
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
      dataIndex: "activityName",
      key: "activityName",
      ellipsis: true,
    },
    {
      title: "ภาควิชา",
      dataIndex: "department",
      key: "department",
      width: 180,
    },
    {
      title: "สาขาวิชา",
      dataIndex: "major",
      key: "major",
      width: 120,
      align: "center",
      render: (major) => (
        <Tag
          color="#0A894C"
          style={{
            borderRadius: 8,
            fontWeight: 500,
          }}
        >
          {major}
        </Tag>
      ),
    },
    {
      title: "จำนวนนักศึกษา",
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
      title: "การจัดการ",
      key: "action",
      width: 150,
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
          <Button
            type="text"
            icon={<Edit size={18} />}
            onClick={() => onEdit(record)}
            style={{ color: "#1890ff" }}
            title="แก้ไข"
          />
          <Popconfirm
            title="ยืนยันการลบ"
            description="คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้?"
            onConfirm={() => onDelete(record)}
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
              title="ลบ"
            />
          </Popconfirm>
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

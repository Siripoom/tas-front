"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  Progress,
  Tag,
  message,
} from "antd";
import {
  Users,
  Calendar,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

const { Option } = Select;

export default function TeacherHome() {
  const themeColor = "#0A894C";
  const [userDepartment, setUserDepartment] = useState("Computer Education");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2568");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // อ่านข้อมูลภาควิชาของครูจาก localStorage
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

  const stats = [
    {
      title: "Total Users",
      value: 150,
      icon: <Users size={24} style={{ color: themeColor }} />,
      color: themeColor,
    },
    {
      title: "Total Events",
      value: 45,
      icon: <Calendar size={24} style={{ color: "#0db359" }} />,
      color: "#0db359",
    },
    {
      title: "Pending Reports",
      value: 12,
      icon: <FileText size={24} style={{ color: "#086b3d" }} />,
      color: "#086b3d",
    },
    {
      title: "Active Events",
      value: 8,
      icon: <Activity size={24} style={{ color: "#05c168" }} />,
      color: "#05c168",
    },
  ];

  // Department options
  const departments = [
    "Computer Education",
    "Civil Engineering Education",
    "Electrical Engineering Education",
    "Mechanical Engineering Education",
    "Information Technology Education",
    "Technical Education Administration",
  ];

  // Academic years
  const academicYears = ["2566", "2567", "2568", "2569"];

  // Mock data for 6 activity categories by department and year
  const activityCategories = {
    "Computer Education": {
      2568: [
        {
          id: 1,
          name: "กิจกรรมวิชาการ",
          nameEn: "Academic Activities",
          eventsCount: 12,
          currentHours: 45,
          targetHours: 60,
          color: "#0A894C",
          icon: <FileText size={20} />,
        },
        {
          id: 2,
          name: "กิจกรรมกีฬา/นันทนาการ",
          nameEn: "Sports & Recreation",
          eventsCount: 8,
          currentHours: 30,
          targetHours: 40,
          color: "#1890ff",
          icon: <Activity size={20} />,
        },
        {
          id: 3,
          name: "กิจกรรมบำเพ็ญประโยชน์/จิตอาสา",
          nameEn: "Community Service",
          eventsCount: 15,
          currentHours: 55,
          targetHours: 50,
          color: "#52c41a",
          icon: <Users size={20} />,
        },
        {
          id: 4,
          name: "กิจกรรมนิสิตสัมพันธ์",
          nameEn: "Student Relations",
          eventsCount: 6,
          currentHours: 20,
          targetHours: 30,
          color: "#fa8c16",
          icon: <Users size={20} />,
        },
        {
          id: 5,
          name: "กิจกรรมศิลปวัฒนธรรม",
          nameEn: "Arts & Culture",
          eventsCount: 10,
          currentHours: 35,
          targetHours: 40,
          color: "#eb2f96",
          icon: <Calendar size={20} />,
        },
        {
          id: 6,
          name: "กิจกรรมเสริมสร้างคุณธรรม จริยธรรม",
          nameEn: "Ethics & Moral Development",
          eventsCount: 7,
          currentHours: 25,
          targetHours: 30,
          color: "#722ed1",
          icon: <CheckCircle size={20} />,
        },
      ],
      2567: [
        {
          id: 1,
          name: "กิจกรรมวิชาการ",
          nameEn: "Academic Activities",
          eventsCount: 10,
          currentHours: 58,
          targetHours: 60,
          color: "#0A894C",
          icon: <FileText size={20} />,
        },
        {
          id: 2,
          name: "กิจกรรมกีฬา/นันทนาการ",
          nameEn: "Sports & Recreation",
          eventsCount: 7,
          currentHours: 40,
          targetHours: 40,
          color: "#1890ff",
          icon: <Activity size={20} />,
        },
        {
          id: 3,
          name: "กิจกรรมบำเพ็ญประโยชน์/จิตอาสา",
          nameEn: "Community Service",
          eventsCount: 12,
          currentHours: 50,
          targetHours: 50,
          color: "#52c41a",
          icon: <Users size={20} />,
        },
        {
          id: 4,
          name: "กิจกรรมนิสิตสัมพันธ์",
          nameEn: "Student Relations",
          eventsCount: 5,
          currentHours: 28,
          targetHours: 30,
          color: "#fa8c16",
          icon: <Users size={20} />,
        },
        {
          id: 5,
          name: "กิจกรรมศิลปวัฒนธรรม",
          nameEn: "Arts & Culture",
          eventsCount: 9,
          currentHours: 40,
          targetHours: 40,
          color: "#eb2f96",
          icon: <Calendar size={20} />,
        },
        {
          id: 6,
          name: "กิจกรรมเสริมสร้างคุณธรรม จริยธรรม",
          nameEn: "Ethics & Moral Development",
          eventsCount: 6,
          currentHours: 30,
          targetHours: 30,
          color: "#722ed1",
          icon: <CheckCircle size={20} />,
        },
      ],
    },
    // Other departments would have similar structure
  };

  // Activity category names for filtering
  const categoryNames = [
    "กิจกรรมวิชาการ",
    "กิจกรรมกีฬา/นันทนาการ",
    "กิจกรรมบำเพ็ญประโยชน์/จิตอาสา",
    "กิจกรรมนิสิตสัมพันธ์",
    "กิจกรรมศิลปวัฒนธรรม",
    "กิจกรรมเสริมสร้างคุณธรรม จริยธรรม",
  ];

  // Get current activity data based on user's department, year, and category
  const getCurrentActivityData = () => {
    let data = activityCategories[userDepartment]?.[selectedAcademicYear] || [];

    // Apply category filter if selected
    if (selectedCategory) {
      data = data.filter((category) => category.name === selectedCategory);
    }

    return data;
  };

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
            ข้อมูลกิจกรรมและชั่วโมงกิจกรรมของภาควิชา
          </p>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              className="shadow-sm"
              styles={{
                body: { padding: "24px" },
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Activity Categories Section */}
      <Card
        className="mt-6 shadow-sm"
        styles={{
          header: {
            backgroundColor: "#e8f5e9",
            borderBottom: "2px solid #0A894C",
            color: "#086b3d",
            fontWeight: "600",
          },
        }}
        title={
          <div className="flex items-center gap-2 ">
            <Clock size={20} style={{ color: "#0A894C" }} />
            <span>จำนวนชั่วโมงกิจกรรม 6 หมวด</span>
          </div>
        }
      >
        {/* Filters */}
        {/* <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ปีการศึกษา (Academic Year)
            </label>
            <Select
              value={selectedAcademicYear}
              onChange={setSelectedAcademicYear}
              style={{ width: "100%" }}
              size="large"
            >
              {academicYears.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมวดกิจกรรม (Category)
            </label>
            <Select
              placeholder="ทั้งหมด 6 หมวด"
              allowClear
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: "100%" }}
              size="large"
            >
              {categoryNames.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </div>
        </div> */}

        {/* Filter Summary */}
        {selectedCategory && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">กำลังแสดง:</span>
            <Tag
              color="#0A894C"
              closable
              onClose={() => setSelectedCategory(null)}
              style={{ fontSize: "13px", padding: "4px 8px" }}
            >
              {selectedCategory}
            </Tag>
          </div>
        )}

        {/* Activity Categories Grid */}
        <Row gutter={[16, 16]}>
          {getCurrentActivityData().map((category) => {
            const percentage = Math.round(
              (category.currentHours / category.targetHours) * 100
            );
            const remainingHours = category.targetHours - category.currentHours;
            const isComplete = category.currentHours >= category.targetHours;

            return (
              <Col xs={24} md={12} lg={8} key={category.id}>
                <Card
                  hoverable
                  className="h-full"
                  style={{
                    borderLeft: `4px solid ${category.color}`,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <div className="space-y-3">
                    {/* Category Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: `${category.color}15`,
                            color: category.color,
                          }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h4
                            className="font-semibold text-sm mb-1"
                            style={{ color: category.color }}
                          >
                            {category.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {category.nameEn}
                          </p>
                        </div>
                      </div>
                      {isComplete && (
                        <div
                          className="p-1 rounded-full"
                          style={{ backgroundColor: "#52c41a15" }}
                        >
                          <CheckCircle size={16} style={{ color: "#52c41a" }} />
                        </div>
                      )}
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">กิจกรรม</p>
                        <p className="text-lg font-bold text-gray-800">
                          {category.eventsCount}
                        </p>
                      </div>
                      <div className="text-center border-l border-r">
                        <p className="text-xs text-gray-500 mb-1">ชั่วโมง</p>
                        <p
                          className="text-lg font-bold"
                          style={{
                            color: isComplete ? "#52c41a" : category.color,
                          }}
                        >
                          {category.currentHours}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">
                          {remainingHours > 0 ? "ขาด" : "เกิน"}
                        </p>
                        <p
                          className="text-lg font-bold"
                          style={{
                            color:
                              remainingHours > 0
                                ? "#fa8c16"
                                : remainingHours < 0
                                ? "#52c41a"
                                : "#0A894C",
                          }}
                        >
                          {Math.abs(remainingHours)}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">ความคืบหน้า</span>
                        <span
                          className="font-semibold"
                          style={{
                            color: isComplete ? "#52c41a" : category.color,
                          }}
                        >
                          {category.currentHours}/{category.targetHours} ชม.
                        </span>
                      </div>
                      <Progress
                        percent={percentage}
                        strokeColor={
                          isComplete
                            ? "#52c41a"
                            : percentage >= 80
                            ? category.color
                            : percentage >= 50
                            ? "#fa8c16"
                            : "#f5222d"
                        }
                        showInfo={false}
                        size="small"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span className="font-medium">{percentage}%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="pt-2 border-t">
                      {isComplete ? (
                        <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-green-50">
                          <CheckCircle size={14} style={{ color: "#52c41a" }} />
                          <span className="text-xs font-medium text-green-700">
                            ครบชั่วโมงแล้ว
                          </span>
                        </div>
                      ) : remainingHours <= 10 ? (
                        <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-orange-50">
                          <TrendingUp size={14} style={{ color: "#fa8c16" }} />
                          <span className="text-xs font-medium text-orange-700">
                            ใกล้ครบชั่วโมง
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-gray-100">
                          <Clock size={14} style={{ color: "#666" }} />
                          <span className="text-xs font-medium text-gray-600">
                            ดำเนินการต่อ
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Summary */}
        {getCurrentActivityData().length > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-full"
                  style={{ backgroundColor: "#0A894C" }}
                >
                  <TrendingUp size={20} style={{ color: "white" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    สรุปภาพรวม {userDepartment} - ปีการศึกษา{" "}
                    {selectedAcademicYear}
                  </p>
                  <p className="text-xs text-gray-600">
                    จำนวนกิจกรรมทั้งหมด:{" "}
                    {getCurrentActivityData().reduce(
                      (sum, cat) => sum + cat.eventsCount,
                      0
                    )}{" "}
                    กิจกรรม | ชั่วโมงรวม:{" "}
                    {getCurrentActivityData().reduce(
                      (sum, cat) => sum + cat.currentHours,
                      0
                    )}
                    /
                    {getCurrentActivityData().reduce(
                      (sum, cat) => sum + cat.targetHours,
                      0
                    )}{" "}
                    ชั่วโมง
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">ความคืบหน้ารวม:</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: "#0A894C" }}
                >
                  {Math.round(
                    (getCurrentActivityData().reduce(
                      (sum, cat) => sum + cat.currentHours,
                      0
                    ) /
                      getCurrentActivityData().reduce(
                        (sum, cat) => sum + cat.targetHours,
                        0
                      )) *
                      100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={16}>
          <Card
            title="Recent Activities"
            className="shadow-sm"
            styles={{
              header: {
                backgroundColor: "#e8f5e9",
                borderBottom: "2px solid #0A894C",
                color: "#086b3d",
                fontWeight: "600",
              },
            }}
          >
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: "#f1f8f4",
                    borderLeft: "3px solid #0A894C",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e8f5e9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f1f8f4";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#0A894C" }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Sample Activity {item}
                      </p>
                      <p className="text-xs text-gray-500">
                        Updated {item} hours ago
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs hover:underline cursor-pointer font-medium"
                    style={{ color: "#0A894C" }}
                  >
                    View Details
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Notifications"
            className="shadow-sm"
            styles={{
              header: {
                backgroundColor: "#e8f5e9",
                borderBottom: "2px solid #0A894C",
                color: "#086b3d",
                fontWeight: "600",
              },
            }}
          >
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="p-3 rounded"
                  style={{
                    backgroundColor: "#f1f8f4",
                    borderLeft: "4px solid #0A894C",
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#086b3d" }}
                  >
                    Notification {item}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    New items require review
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

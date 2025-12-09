"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Select, Progress, Tag, Spin } from "antd";
import {
  Users,
  Calendar,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { getAllUsers } from "@/services/user";
import { getAllActivities, getActivitiesWithQuery } from "@/services/activity";
import { getAllTypeActivities } from "@/services/typeActivity";
import { getAllAttendances } from "@/services/attendance";

const { Option } = Select;

export default function AdminHome() {
  const themeColor = "#0A894C";
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [typeActivities, setTypeActivities] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [categoryActivities, setCategoryActivities] = useState([]);
  const [departmentMap, setDepartmentMap] = useState(new Map());

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, activitiesData, typeActivitiesData, attendancesData] =
        await Promise.all([
          getAllUsers(),
          getAllActivities(),
          getAllTypeActivities(),
          getAllAttendances(),
        ]);

      setUsers(usersData);
      setActivities(activitiesData);
      setTypeActivities(typeActivitiesData);
      setAttendances(attendancesData);

      // Build department name to ID mapping
      const deptMap = new Map();
      activitiesData.forEach((activity) => {
        if (activity.department?.id && activity.department?.name) {
          deptMap.set(activity.department.name, activity.department.id);
        }
      });
      setDepartmentMap(deptMap);

      // Set default department to first available
      if (activitiesData.length > 0 && !selectedDepartment) {
        const firstDept = activitiesData.find((a) => a.department)?.department
          ?.name;
        if (firstDept) {
          setSelectedDepartment(firstDept);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch category activities when department changes
  useEffect(() => {
    const fetchCategoryActivities = async () => {
      if (!selectedDepartment) {
        setCategoryActivities([]);
        return;
      }

      const departmentId = departmentMap.get(selectedDepartment);
      if (!departmentId) {
        setCategoryActivities([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getActivitiesWithQuery({
          departmentId,
        });
        setCategoryActivities(data.activities || []);
      } catch (error) {
        console.error("Error fetching category activities:", error);
        setCategoryActivities([]);
      } finally {
        setLoading(false);
      }
    };

    if (departmentMap.size > 0) {
      fetchCategoryActivities();
    }
  }, [selectedDepartment, departmentMap]);

  // Calculate stats from real data
  const getStats = () => {
    const totalUsers = users.length;
    const totalEvents = activities.length;
    const activeEvents = activities.filter(
      (a) => a.status === "inprogress"
    ).length;
    const pendingReports = activities.filter(
      (a) => a.status === "planned"
    ).length;

    return [
      {
        title: "Total Users",
        value: totalUsers,
        icon: <Users size={24} style={{ color: themeColor }} />,
        color: themeColor,
      },
      {
        title: "Total Events",
        value: totalEvents,
        icon: <Calendar size={24} style={{ color: "#0db359" }} />,
        color: "#0db359",
      },
      {
        title: "Pending Reports",
        value: pendingReports,
        icon: <FileText size={24} style={{ color: "#086b3d" }} />,
        color: "#086b3d",
      },
      {
        title: "Active Events",
        value: activeEvents,
        icon: <Activity size={24} style={{ color: "#05c168" }} />,
        color: "#05c168",
      },
    ];
  };

  // Get unique departments from activities
  const getDepartments = () => {
    const deptSet = new Set();
    activities.forEach((activity) => {
      if (activity.department?.name) {
        deptSet.add(activity.department.name);
      }
    });
    return Array.from(deptSet);
  };

  const departments = getDepartments();

  // Category colors and icons mapping (matching API response type activity names)
  const categoryConfig = {
    วิชาการ: {
      color: "#0A894C",
      icon: <FileText size={20} />,
      nameEn: "Academic Activities",
    },
    กีฬา: {
      color: "#1890ff",
      icon: <Activity size={20} />,
      nameEn: "Sports & Recreation",
    },
    จิตอาสา: {
      color: "#52c41a",
      icon: <Users size={20} />,
      nameEn: "Community Service",
    },
    นิสิตสัมพันธ์: {
      color: "#fa8c16",
      icon: <Users size={20} />,
      nameEn: "Student Relations",
    },
    ศิลปวัฒนธรรม: {
      color: "#eb2f96",
      icon: <Calendar size={20} />,
      nameEn: "Arts & Culture",
    },
    คุณธรรม: {
      color: "#722ed1",
      icon: <CheckCircle size={20} />,
      nameEn: "Ethics & Moral Development",
    },
  };

  // Get current activity data based on selected department
  const getCurrentActivityData = () => {
    // Use categoryActivities fetched from API (no client-side filtering)
    const filteredActivities = categoryActivities;

    // Group by typeActivity and calculate hours
    const categoryMap = new Map();

    filteredActivities.forEach((activity) => {
      const categoryName = activity.typeActivity?.name;
      if (!categoryName) return;

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          id: activity.typeActivity.id,
          name: categoryName,
          nameEn: categoryConfig[categoryName]?.nameEn || categoryName,
          eventsCount: 0,
          currentHours: 0,
          targetHours: 60, // Default target hours
          color: categoryConfig[categoryName]?.color || "#0A894C",
          icon: categoryConfig[categoryName]?.icon || <FileText size={20} />,
        });
      }

      const category = categoryMap.get(categoryName);
      category.eventsCount += 1;
      category.currentHours += activity.hour || 0;
    });

    return Array.from(categoryMap.values());
  };

  // Get recent activities
  const getRecentActivities = () => {
    return activities
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      )
      .slice(0, 4);
  };

  return (
    <Spin spinning={loading}>
      <div>
        <Row gutter={[16, 16]}>
          {getStats().map((stat, index) => (
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
          <div className="mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ภาควิชา (Department)
              </label>
              <Select
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                style={{ width: "100%" }}
                size="large"
              >
                {departments.map((dept) => (
                  <Option key={dept} value={dept}>
                    {dept}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Activity Categories Grid */}
          <Row gutter={[16, 16]}>
            {getCurrentActivityData().map((category) => {
              const percentage = Math.round(
                (category.currentHours / category.targetHours) * 100
              );
              const remainingHours =
                category.targetHours - category.currentHours;
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
                            <CheckCircle
                              size={16}
                              style={{ color: "#52c41a" }}
                            />
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
                            <CheckCircle
                              size={14}
                              style={{ color: "#52c41a" }}
                            />
                            <span className="text-xs font-medium text-green-700">
                              ครบชั่วโมงแล้ว
                            </span>
                          </div>
                        ) : remainingHours <= 10 ? (
                          <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-orange-50">
                            <TrendingUp
                              size={14}
                              style={{ color: "#fa8c16" }}
                            />
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
                      สรุปภาพรวม {selectedDepartment}
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
                {getRecentActivities().map((activity, index) => {
                  const timeAgo = activity.updatedAt
                    ? new Date(activity.updatedAt).toLocaleDateString("th-TH")
                    : new Date(activity.createdAt).toLocaleDateString("th-TH");

                  return (
                    <div
                      key={activity.id}
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
                            {activity.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.department?.name} • {timeAgo}
                          </p>
                        </div>
                      </div>
                      <Tag
                        color={
                          activity.status === "completed"
                            ? "green"
                            : activity.status === "inprogress"
                            ? "blue"
                            : activity.status === "cancelled"
                            ? "red"
                            : "orange"
                        }
                      >
                        {activity.status}
                      </Tag>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
}

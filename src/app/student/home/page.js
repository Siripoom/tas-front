"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Carousel,
  Progress,
  Modal,
  message,
  Tag,
} from "antd";
import {
  CalendarCheck,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function StudentHome() {
  const carouselRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [joinModalVisible, setJoinModalVisible] = useState(false);

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

  // Mock data for available activities
  const availableActivities = [
    {
      id: 1,
      name: "AI Technology Lecture",
      category: "Academic Activity",
      department: "Computer Education",
      date: "15 Jan 2025",
      time: "13:00 - 16:00",
      location: "Room A301",
      hours: 3,
      maxParticipants: 50,
      currentParticipants: 32,
      image: null,
    },
    {
      id: 2,
      name: "Community Development",
      category: "Volunteer Activity",
      department: "Civil Engineering Education",
      date: "20 Jan 2025",
      time: "09:00 - 15:00",
      location: "Suan Dok Community",
      hours: 6,
      maxParticipants: 30,
      currentParticipants: 18,
      image: null,
    },
    {
      id: 3,
      name: "Internal Sports Competition",
      category: "Sports Activity",
      department: "Mechanical Engineering Education",
      date: "25 Jan 2025",
      time: "08:00 - 17:00",
      location: "Main Stadium",
      hours: 8,
      maxParticipants: 100,
      currentParticipants: 76,
      image: null,
    },
    {
      id: 4,
      name: "Thai Art and Culture Event",
      category: "Art and Culture",
      department: "Electrical Engineering",
      date: "1 Feb 2025",
      time: "10:00 - 16:00",
      location: "Main Hall",
      hours: 6,
      maxParticipants: 80,
      currentParticipants: 45,
      image: null,
    },
    {
      id: 5,
      name: "Buddhist Merit Making",
      category: "Religious Activity",
      department: "Information Technology Education",
      date: "5 Feb 2025",
      time: "07:00 - 09:00",
      location: "Building 1 Front Yard",
      hours: 2,
      maxParticipants: 200,
      currentParticipants: 134,
      image: null,
    },
    {
      id: 6,
      name: "Industrial Plant Visit",
      category: "Study Tour",
      department: "Mechanical Engineering Education",
      date: "10 Feb 2025",
      time: "08:00 - 17:00",
      location: "Rayong Province",
      hours: 8,
      maxParticipants: 40,
      currentParticipants: 28,
      image: null,
    },
    {
      id: 7,
      name: "Student Council Meeting 1/2025",
      category: "Student Council",
      department: "Computer Education",
      date: "15 Feb 2025",
      time: "14:00 - 16:00",
      location: "Student Council Room",
      hours: 2,
      maxParticipants: 60,
      currentParticipants: 22,
      image: null,
    },
    {
      id: 8,
      name: "Workshop: Web Development",
      category: "Academic Activity",
      department: "Computer Education",
      date: "20 Feb 2025",
      time: "13:00 - 17:00",
      location: "Computer Lab 2",
      hours: 4,
      maxParticipants: 35,
      currentParticipants: 30,
      image: null,
    },
    {
      id: 9,
      name: "Royal Reforestation Project",
      category: "Volunteer Activity",
      department: "Civil Engineering Education",
      date: "25 Feb 2025",
      time: "08:00 - 12:00",
      location: "Wildlife Sanctuary",
      hours: 4,
      maxParticipants: 50,
      currentParticipants: 41,
      image: null,
    },
  ];

  // Mock data for student activity statistics
  const activityStats = [
    {
      category: "Student Council",
      required: 10,
      completed: 6,
      remaining: 4,
      color: "#3b82f6",
      icon: "👥",
    },
    {
      category: "Religious Activity",
      required: 8,
      completed: 8,
      remaining: 0,
      color: "#8b5cf6",
      icon: "🙏",
    },
    {
      category: "Volunteer Activity",
      required: 12,
      completed: 5,
      remaining: 7,
      color: "#10b981",
      icon: "🤝",
    },
    {
      category: "Sports Activity",
      required: 10,
      completed: 10,
      remaining: 0,
      color: "#f59e0b",
      icon: "⚽",
    },
    {
      category: "Art and Culture",
      required: 8,
      completed: 3,
      remaining: 5,
      color: "#ec4899",
      icon: "🎨",
    },
    {
      category: "Academic/Study Tour",
      required: 12,
      completed: 9,
      remaining: 3,
      color: "#06b6d4",
      icon: "📚",
    },
  ];

  // Calculate total statistics
  const totalRequired = activityStats.reduce(
    (sum, stat) => sum + stat.required,
    0
  );
  const totalCompleted = activityStats.reduce(
    (sum, stat) => sum + stat.completed,
    0
  );
  const totalRemaining = totalRequired - totalCompleted;
  const completionPercentage = Math.round(
    (totalCompleted / totalRequired) * 100
  );

  // Split activities into pages (3 per page)
  const activitiesPerPage = 3;
  const pages = [];
  for (let i = 0; i < availableActivities.length; i += activitiesPerPage) {
    pages.push(availableActivities.slice(i, i + activitiesPerPage));
  }

  const handleJoinActivity = (activity) => {
    setSelectedActivity(activity);
    setJoinModalVisible(true);
  };

  const confirmJoinActivity = () => {
    message.success(`Successfully registered for "${selectedActivity.name}"`);
    setJoinModalVisible(false);
    setSelectedActivity(null);
  };

  const ActivityCard = ({ activity }) => {
    const availableSlots =
      activity.maxParticipants - activity.currentParticipants;
    const isFull = availableSlots === 0;

    return (
      <Card
        hoverable
        className="h-full"
        style={{
          borderRadius: 12,
          border: "1px solid #e8f5e9",
          boxShadow: "0 2px 8px rgba(10, 137, 76, 0.08)",
        }}
      >
        {/* Activity Image Placeholder */}
        <div
          className="w-full h-40 rounded-lg mb-4 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #0A894C 0%, #0ea258 100%)",
          }}
        >
          <CalendarCheck size={48} className="text-white opacity-70" />
        </div>

        {/* Category Tag */}
        <Tag
          color="green"
          className="mb-2"
          style={{ borderRadius: 6, padding: "2px 10px" }}
        >
          {activity.category}
        </Tag>

        {/* Activity Name */}
        <h3 className="text-lg font-bold mb-3 text-gray-800 line-clamp-2">
          {activity.name}
        </h3>

        {/* Activity Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <CalendarCheck size={16} />
            <span>{activity.date}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Clock size={16} />
            <span>
              {activity.time} ({activity.hours} hours)
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin size={16} />
            <span className="line-clamp-1">{activity.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Users size={16} />
            <span>
              {activity.currentParticipants}/{activity.maxParticipants}{" "}
              participants
              {!isFull && (
                <span className="text-green-600 ml-1">
                  ({availableSlots} slots left)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Join Button */}
        <Button
          type="primary"
          block
          size="large"
          disabled={isFull}
          onClick={() => handleJoinActivity(activity)}
          style={{
            backgroundColor: isFull ? "#d1d5db" : "#0A894C",
            borderColor: isFull ? "#d1d5db" : "#0A894C",
            borderRadius: 8,
            height: 44,
            fontWeight: 600,
          }}
        >
          {isFull ? "Full" : "Register Now"}
        </Button>
      </Card>
    );
  };

  const StatCard = ({ stat }) => {
    const percentage = Math.round((stat.completed / stat.required) * 100);
    const isCompleted = stat.remaining === 0;

    return (
      <Card
        style={{
          borderRadius: 12,
          border: `2px solid ${stat.color}20`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="text-4xl p-3 rounded-xl"
            style={{ backgroundColor: `${stat.color}15` }}
          >
            {stat.icon}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-800 mb-2">
              {stat.category}
            </h4>

            {/* Progress Bar */}
            <Progress
              percent={percentage}
              strokeColor={stat.color}
              trailColor={`${stat.color}20`}
              showInfo={false}
              strokeWidth={10}
              className="mb-2"
            />

            {/* Statistics */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  Completed:{" "}
                  <span className="font-semibold" style={{ color: stat.color }}>
                    {stat.completed}/{stat.required} hrs
                  </span>
                </span>
                {isCompleted ? (
                  <Tag
                    icon={<CheckCircle size={14} />}
                    color="success"
                    style={{ borderRadius: 6 }}
                  >
                    Done
                  </Tag>
                ) : (
                  <span className="text-orange-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    Need {stat.remaining} hrs
                  </span>
                )}
              </div>
              <span className="font-bold text-lg" style={{ color: stat.color }}>
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div>
      {/* Welcome Banner */}
      <Card
        className="mb-4 md:mb-6 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #0A894C 0%, #0ea258 100%)",
          border: "none",
        }}
      >
        <div className="text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Welcome, {userInfo?.name || "Student"}! 👋
          </h2>
          <p className="text-xs md:text-sm opacity-90">
            Track and join activities to earn your activity hours
          </p>
        </div>
      </Card>

      {/* Overall Statistics Summary */}
      <Row gutter={[12, 12]} className="mb-4 md:mb-6 mt-4 md:mt-6">
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: 12,
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              border: "none",
            }}
          >
            <div className="text-white">
              <p className="text-xs md:text-sm opacity-90 mb-1">Total Hours</p>
              <h3 className="text-2xl md:text-3xl font-bold">
                {totalCompleted}{" "}
                <span className="text-base md:text-lg font-normal">hrs</span>
              </h3>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: 12,
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              border: "none",
            }}
          >
            <div className="text-white">
              <p className="text-xs md:text-sm opacity-90 mb-1">Hours Needed</p>
              <h3 className="text-2xl md:text-3xl font-bold">
                {totalRemaining}{" "}
                <span className="text-base md:text-lg font-normal">hrs</span>
              </h3>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: 12,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
            }}
          >
            <div className="text-white">
              <p className="text-xs md:text-sm opacity-90 mb-1">Progress</p>
              <h3 className="text-2xl md:text-3xl font-bold">
                {completionPercentage}{" "}
                <span className="text-base md:text-lg font-normal">%</span>
              </h3>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Activity Statistics by Category */}
      <Card
        className="mb-6 md:mb-10"
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h2 className="text-lg md:text-xl font-bold mb-4" style={{ color: "#0A894C" }}>
          Activity Statistics by Category
        </h2>
        <Row gutter={[12, 12]}>
          {activityStats.map((stat, index) => (
            <Col xs={24} lg={12} key={index}>
              <StatCard stat={stat} />
            </Col>
          ))}
        </Row>
      </Card>

      {/* Available Activities Carousel */}
      <Card
        className=""
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-2" style={{ color: "#0A894C" }}>
            Available Activities
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Choose activities you are interested in and register to earn hours
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => carouselRef.current?.prev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-[#0A894C] text-[#0A894C] hover:text-white p-3 rounded-full shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#0A894C]"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => carouselRef.current?.next()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-[#0A894C] text-[#0A894C] hover:text-white p-3 rounded-full shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#0A894C]"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel */}
          <Carousel
            ref={carouselRef}
            dots={{
              className: "custom-activity-dots",
            }}
            autoplay
            autoplaySpeed={6000}
            speed={800}
          >
            {pages.map((pageActivities, pageIndex) => (
              <div key={pageIndex}>
                <Row gutter={[16, 16]} className="px-2">
                  {pageActivities.map((activity) => (
                    <Col xs={24} sm={12} lg={8} key={activity.id}>
                      <ActivityCard activity={activity} />
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </Carousel>
        </div>
      </Card>

      {/* Join Activity Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CalendarCheck size={20} style={{ color: "#0A894C" }} />
            <span className="text-base md:text-lg">Confirm Registration</span>
          </div>
        }
        open={joinModalVisible}
        onOk={confirmJoinActivity}
        onCancel={() => {
          setJoinModalVisible(false);
          setSelectedActivity(null);
        }}
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{
          style: { backgroundColor: "#0A894C", borderColor: "#0A894C" },
        }}
        width={typeof window !== 'undefined' && window.innerWidth < 768 ? "95%" : 500}
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        {selectedActivity && (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedActivity.name}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Tag color="green">{selectedActivity.category}</Tag>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CalendarCheck size={18} />
                <span>{selectedActivity.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={18} />
                <span>
                  {selectedActivity.time} ({selectedActivity.hours} hours)
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={18} />
                <span>{selectedActivity.location}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <CheckCircle size={16} className="inline mr-1" />
                You will earn <strong>
                  {selectedActivity.hours} hours
                </strong>{" "}
                from this activity
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Custom Carousel Dots Styling */}
      <style jsx global>{`
        .custom-activity-dots {
          bottom: -40px !important;
        }
        .custom-activity-dots li button {
          background: #cbd5e1 !important;
          height: 8px !important;
          border-radius: 4px !important;
        }
        .custom-activity-dots li.slick-active button {
          background: #0a894c !important;
          width: 32px !important;
        }
      `}</style>
    </div>
  );
}

"use client";

import { Card, Row, Col, Statistic } from "antd";
import { Users, Calendar, FileText, Activity } from "lucide-react";

export default function AdminHome() {
  const themeColor = "#0A894C";
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

  return (
    <div>
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
                  <p className="text-sm font-medium" style={{ color: "#086b3d" }}>
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

"use client";

import { Carousel, Row, Col, Spin } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ActivityCard from "./ActivityCard";
import { useRef, useState, useEffect } from "react";
import { getAllActivities } from "@/services/activity";

const NewsCarousel = () => {
  const carouselRef = useRef(null);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await getAllActivities();

        // Transform API data to match component structure
        const transformedData = response.map((activity) => ({
          id: activity.id,
          title: activity.name,
          department: activity.department?.name || "ไม่ระบุภาควิชา",
          date: new Date(activity.date).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          imageUrl: activity.fileActivities?.[0]?.fileUrl || null,
        }));

        setNewsData(transformedData);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Split data into chunks of 9 (3x3 grid)
  const chunkSize = 9;
  const pages = [];
  for (let i = 0; i < newsData.length; i += chunkSize) {
    pages.push(newsData.slice(i, i + chunkSize));
  }

  // Show loading state
  if (loading) {
    return (
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-center items-center min-h-[400px]">
            <Spin size="large" tip="กำลังโหลดข้อมูลกิจกรรม..." />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img
              src="/Logo.png"
              alt="Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            ข่าวสารและกิจกรรม
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            ติดตามกิจกรรมของคณะครุศาสตร์อุตสาหกรรม ผ่านข่าวสารและกิจกรรมต่าง ๆ
            ที่เราจัดขึ้นเพื่อส่งเสริมการเรียนรู้และพัฒนาทักษะของนักศึกษา
          </p>
        </div>

        {/* Carousel Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100 relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => carouselRef.current?.prev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-[#3D5753] text-[#3D5753] hover:text-white p-3 rounded-full shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#3D5753]"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => carouselRef.current?.next()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-[#3D5753] text-[#3D5753] hover:text-white p-3 rounded-full shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#3D5753]"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel */}
          <Carousel
            ref={carouselRef}
            dots={{
              className: "custom-dots",
            }}
            autoplay
            autoplaySpeed={5000}
            speed={800}
          >
            {newsData.length > 0 ? (
              pages.map((pageItems, pageIndex) => (
                <div key={pageIndex}>
                  <Row gutter={[24, 24]} className="px-8">
                    {pageItems.map((item) => (
                      <Col xs={24} sm={12} lg={8} key={item.id}>
                        <ActivityCard
                          title={item.title}
                          department={item.department}
                          date={item.date}
                          imageUrl={item.imageUrl}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">ไม่พบข้อมูลกิจกรรม</p>
              </div>
            )}
          </Carousel>
        </div>

        {/* Custom Dots Styling */}
        <style jsx global>{`
          .custom-dots {
            bottom: -40px !important;
          }
          .custom-dots li button {
            background: #cbd5e1 !important;
            height: 8px !important;
            border-radius: 4px !important;
          }
          .custom-dots li.slick-active button {
            background: #3d5753 !important;
            width: 32px !important;
          }
        `}</style>
      </div>
    </section>
  );
};

export default NewsCarousel;

"use client";

import { Carousel, Row, Col } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ActivityCard from "./ActivityCard";
import { useRef } from "react";

const NewsCarousel = () => {
  const carouselRef = useRef(null);

  // Sample news data - 18 items to show 2 pages of 3x3
  const newsData = [
    // Page 1
    {
      id: 1,
      title: "การบรรยายพิเศษ: เทคโนโลยี AI และการประยุกต์ใช้ในอุตสาหกรรม",
      department: "ภาควิชาวิศวกรรมคอมพิวเตอร์",
      date: "15 มกราคม 2568",
      imageUrl: null,
    },
    {
      id: 2,
      title: "โครงการพัฒนาพลังงานทดแทนเพื่อชุมชนท้องถิ่น",
      department: "ภาควิชาวิศวกรรมไฟฟ้า",
      date: "20 มกราคม 2568",
      imageUrl: null,
    },
    {
      id: 3,
      title: "งานวิจัยด้านระบบอัตโนมัติในโรงงานอุตสาหกรรม",
      department: "ภาควิชาวิศวกรรมเครื่องกล",
      date: "25 มกราคม 2568",
      imageUrl: null,
    },
    {
      id: 4,
      title: "การพัฒนาระบบจัดการข้อมูลขนาดใหญ่",
      department: "ภาควิชาวิศวกรรมคอมพิวเตอร์",
      date: "1 กุมภาพันธ์ 2568",
      imageUrl: null,
    },
    {
      id: 5,
      title: "โครงการวิจัยพัฒนาวัสดุก่อสร้างที่เป็นมิตรต่อสิ่งแวดล้อม",
      department: "ภาควิชาวิศวกรรมโยธา",
      date: "5 กุมภาพันธ์ 2568",
      imageUrl: null,
    },
    {
      id: 6,
      title: "นวัตกรรมการผลิตเครื่องจักรกลอัจฉริยะ",
      department: "ภาควิชาวิศวกรรมเครื่องกล",
      date: "10 กุมภาพันธ์ 2568",
      imageUrl: null,
    },
    {
      id: 7,
      title: "การพัฒนาระบบควบคุมอัตโนมัติด้วย IoT",
      department: "ภาควิชาวิศวกรรมไฟฟ้า",
      date: "15 กุมภาพันธ์ 2568",
      imageUrl: null,
    },
    {
      id: 8,
      title: "งานสัมมนาวิชาการด้านความปลอดภัยทางไซเบอร์",
      department: "ภาควิชาวิศวกรรมคอมพิวเตอร์",
      date: "20 กุมภาพันธ์ 2568",
      imageUrl: null,
    },
    {
      id: 9,
      title: "โครงการอนุรักษ์พลังงานในอาคารสูง",
      department: "ภาควิชาวิศวกรรมโยธา",
      date: "25 กุมภาพันธ์ 2568",
      imageUrl: null,
    },
    // Page 2
    {
      id: 10,
      title: "การพัฒนาเทคโนโลยีหุ่นยนต์อัตโนมัติ",
      department: "ภาควิชาวิศวกรรมเครื่องกล",
      date: "1 มีนาคม 2568",
      imageUrl: null,
    },
    {
      id: 11,
      title: "นวัตกรรมพลังงานสะอาดเพื่ออนาคต",
      department: "ภาควิชาวิศวกรรมไฟฟ้า",
      date: "5 มีนาคม 2568",
      imageUrl: null,
    },
    {
      id: 12,
      title: "การประยุกต์ใช้ Machine Learning ในการวิเคราะห์ข้อมูล",
      department: "ภาควิชาวิศวกรรมคอมพิวเตอร์",
      date: "10 มีนาคม 2568",
      imageUrl: null,
    },
    {
      id: 13,
      title: "โครงการพัฒนาโครงสร้างพื้นฐานอัจฉริยะ",
      department: "ภาควิชาวิศวกรรมโยธา",
      date: "15 มีนาคม 2568",
      imageUrl: null,
    },
    {
      id: 14,
      title: "การออกแบบระบบทำความเย็นประหยัดพลังงาน",
      department: "ภาควิชาวิศวกรรมเครื่องกล",
      date: "20 มีนาคม 2568",
      imageUrl: null,
    },
    {
      id: 15,
      title: "นวัตกรรมการจัดการพลังงานไฟฟ้าอัจฉริยะ",
      department: "ภาควิชาวิศวกรรมไฟฟ้า",
      date: "25 มีนาคม 2568",
      imageUrl: null,
    },
    {
      id: 16,
      title: "การพัฒนาแอปพลิเคชันมือถือด้วย React Native",
      department: "ภาควิชาวิศวกรรมคอมพิวเตอร์",
      date: "1 เมษายน 2568",
      imageUrl: null,
    },
    {
      id: 17,
      title: "โครงการวิจัยด้านวัสดุศาสตร์ขั้นสูง",
      department: "ภาควิชาวิศวกรรมโยธา",
      date: "5 เมษายน 2568",
      imageUrl: null,
    },
    {
      id: 18,
      title: "การพัฒนาระบบขนส่งอัจฉริยะ",
      department: "ภาควิชาวิศวกรรมเครื่องกล",
      date: "10 เมษายน 2568",
      imageUrl: null,
    },
  ];

  // Split data into chunks of 9 (3x3 grid)
  const chunkSize = 9;
  const pages = [];
  for (let i = 0; i < newsData.length; i += chunkSize) {
    pages.push(newsData.slice(i, i + chunkSize));
  }

  return (
    <section className="w-full py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-3">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-[#3D5753] to-transparent rounded-full"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            ข่าวสารและกิจกรรม
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            ติดตามกิจกรรมทางวิชาการ งานวิจัย และโครงการพัฒนาต่างๆ
            ของคณาจารย์คณะวิศวกรรมศาสตร์
          </p>
          <div className="mt-3 h-1 w-16 bg-gradient-to-r from-transparent via-[#3D5753] to-transparent rounded-full mx-auto"></div>
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
            {pages.map((pageItems, pageIndex) => (
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
            ))}
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
            background: #3D5753 !important;
            width: 32px !important;
          }
        `}</style>
      </div>
    </section>
  );
};

export default NewsCarousel;

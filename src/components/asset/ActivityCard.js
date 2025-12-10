"use client";

import { Card } from "antd";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

const { Meta } = Card;

const ActivityCard = ({ title, department, date, imageUrl }) => {
  return (
    <Card
      hoverable
      className="h-full rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      cover={
        imageUrl ? (
          <div className="relative h-48 bg-white">
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          </div>
        ) : (
          <div className="h-48 bg-white flex items-center justify-center">
            <div className="flex items-center justify-center w-full h-full p-6">
              <img
                src="/Logo.png"
                alt="Logo"
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>
        )
      }
    >
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-800 line-clamp-2 min-h-[3rem]">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="text-[#3D5753] flex-shrink-0" />
          <span className="line-clamp-1">{department}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} className="text-[#3D5753] flex-shrink-0" />
          <span>{date}</span>
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;

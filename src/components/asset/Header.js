"use client";

import { useRouter } from "next/navigation";
import CustomButton from "./CustomButton";
import { LogIn } from "lucide-react";
import Image from "next/image";

const Header = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <header className="bg-gradient-to-r from-white via-gray-50 to-white shadow-lg sticky top-0 z-50 border-b-2 border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3D5753] to-[#5a7d77] rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
              <Image
                src="/fte-removebg-preview 1 (1).png"
                alt="TAS Logo"
                width={100}
                height={100}
                priority
                className="object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Login Button */}

          <CustomButton
            onClick={handleLoginClick}
            icon={<LogIn size={16} />}
            backgroundColor="#3D5753"
            hoverBackgroundColor="#2d4440"
            height="2.25rem"
            fontSize="0.875rem"
            fontWeight="500"
            shadow="md"
          >
            เข้าสู่ระบบ
          </CustomButton>
        </div>
      </div>
    </header>
  );
};

export default Header;

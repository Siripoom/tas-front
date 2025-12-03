"use client";

import { Button } from "antd";

const CustomButton = ({
  children,
  onClick,
  type = "primary",
  size = "large",
  loading = false,
  disabled = false,
  block = false,
  icon = null,
  backgroundColor = "#2D2D2D",
  hoverBackgroundColor = "#3D3D3D",
  textColor = "#ffffff",
  borderRadius = "3.5rem",
  height = "3rem",
  fontSize = "1rem",
  fontWeight = "500",
  shadow = "lg",
  className = "",
  htmlType = "button",
  ...props
}) => {
  const buttonStyle = {
    background: type === "primary" ? backgroundColor : undefined,
    color: textColor,
    borderRadius: borderRadius,
    height: height,
    fontSize: fontSize,
    fontWeight: fontWeight,
    border: "none",
    transition: "all 0.3s ease",
  };

  const shadowClass = {
    sm: "shadow-sm hover:shadow-md",
    md: "shadow-md hover:shadow-lg",
    lg: "shadow-lg hover:shadow-xl",
    xl: "shadow-xl hover:shadow-2xl",
    none: "",
  };

  const combinedClassName = `${
    shadowClass[shadow] || shadowClass.lg
  } ${className}`;

  return (
    <Button
      type={type}
      size={size}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      block={block}
      icon={icon}
      htmlType={htmlType}
      style={buttonStyle}
      className={combinedClassName}
      onMouseEnter={(e) => {
        if (type === "primary" && !disabled && !loading) {
          e.currentTarget.style.background = hoverBackgroundColor;
        }
      }}
      onMouseLeave={(e) => {
        if (type === "primary" && !disabled && !loading) {
          e.currentTarget.style.background = backgroundColor;
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;

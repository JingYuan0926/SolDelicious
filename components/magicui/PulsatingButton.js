import React from "react";

const PulsatingButton = ({
  className,
  children,
  pulseColor = "rgba(147, 51, 234, 0.5)", // Default to a semi-transparent purple
  duration = "2s",
  ...props
}) => {
  return (
    <button
      className={`relative text-center cursor-pointer flex justify-center items-center rounded-lg text-white bg-purple-600 px-4 py-2 ${className}`}
      style={{
        "--pulse-color": pulseColor,
        "--duration": duration,
      }}
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute top-1/2 left-1/2 w-full h-full rounded-lg bg-purple-600 animate-pulse -translate-x-1/2 -translate-y-1/2" />
    </button>
  );
};

export default PulsatingButton;
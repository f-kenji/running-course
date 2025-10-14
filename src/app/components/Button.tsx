import React, { useEffect, useRef } from 'react'

type ButtonProps = {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    variant?: "primary" | "secondary";
    disabled?: boolean;
};

export default function Button({
    onClick,
    children,
    className = "",
    style = {},
    disabled = false,
    type = "button",
    variant = "primary",
}: ButtonProps) {
    const baseStyle =
        "px-4 py-2 rounded-xl flex items-center justify-center \
         transition duration-90 active:scale-80";

    const variants = {
        primary: "font-semibold text-white bg-rose-600 hover:bg-red-600",
        secondary: "border border-gray-300 hover:bg-gray-200"
    };
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            disabled={disabled}
            style={style}
        >
            {children}
        </button>
    )
}
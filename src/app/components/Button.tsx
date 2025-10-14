import React from 'react'

type ButtonProps = {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
    disabled?: boolean;
};

export default function Button({
    onClick,
    children,
    className = "",
    disabled = false,
    type = "button",
    variant = "primary",
}: ButtonProps) {
    const baseStyle =
        "px-4 py-2 rounded-md flex items-center justify-center transition";

    const variants = {
        primary: "font-semibold text-white bg-red-500 hover:bg-red-600",
        secondary: "border border-gray-300 hover:bg-gray-200"
    };
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

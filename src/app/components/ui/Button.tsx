
type ButtonProps = {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    variant?: "primary" | "secondary" | "tertiary";
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
    // ----------------------------------------
    // CSS 
    // ----------------------------------------
    const baseStyle =
        "rounded-xl flex items-center justify-center \
         transition duration-90 active:scale-80";

    const variants = {
        primary: "text-white bg-rose-600 hover:bg-rose-800",
        secondary: "border border-gray-300 hover:bg-gray-200",
        tertiary: "text-rose-600 border border-rose-200 bg-white hover:bg-rose-100",
    };
    // ----------------------------------------
    // JSX 
    // ----------------------------------------
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
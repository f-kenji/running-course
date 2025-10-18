"use client";
import { useState } from "react";
import { CATEGORY_LABELS } from "@/types/course.labels";
import attributes from "@/app/data/courseAttributes.json";
import Button from "@/app/components/ui/Button";

type Props = {
    selected: Record<string, string>;
    setSelected: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

export default function AttributeSelect({ selected, setSelected }: Props) {
    const handleSelect = (category: string, value: string) => {
        setSelected(prev => {
            // すでに同じ値を選んでいたら解除（＝トグル）
            if (prev[category] === value) {
                const newState = { ...prev };
                delete newState[category];
                return newState;
            }
            // 新しい選択をセット
            return { ...prev, [category]: value };
        });
    };
    // ----------------------------------------
    // JSX 
    // ----------------------------------------
    return (
        <div className="flex flex-wrap">
            {Object.entries(attributes).map(([key, options]) => (
                <div className="p-2" key={key}>
                    <div className="text-xs text-gray-500">{CATEGORY_LABELS[key]}</div>
                    <div className="flex ">
                        {options.map(opt => {
                            const isSelected = selected[key] === opt;
                            return (
                                <Button
                                    key={opt}
                                    onClick={() => handleSelect(key, opt)}
                                    variant={isSelected ? "secondary" : "tertiary"}
                                    className={`px-1 ${isSelected ? "bg-rose-600 text-white hover:bg-rose-600" : ""}`}
                                >
                                    {opt}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
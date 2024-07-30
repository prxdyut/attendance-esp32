import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface PopupButtonProps {
  label: string;
  children: React.ReactNode;
}

export const PopupButton: React.FC<PopupButtonProps> = ({
  label,
  children,
}) => {
  const [activePopup, setActivePopup] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setActivePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        className="border px-2 py-1"
        onClick={() => setActivePopup(!activePopup)}
      >
        {label}
      </button>
      {activePopup && (
        <div
          ref={popupRef}
          className="absolute right-0 top-full mt-1 w-max rounded border bg-white p-2 shadow-lg"
        >
          {children}
        </div>
      )}
    </div>
  );
};

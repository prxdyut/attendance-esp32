import React, { useState, useRef, useEffect, useMemo } from "react";
import { handleFetch } from "../utils/handleFetch";

type Option = { type: string; label: string; value: string };
type Header = { type: "header"; label: string };
type ItemAll = { type: "all" };
type Item = Option | Header | ItemAll;

type SelectionType = "all" | "userIds" | "batchIds";
type TargetSelectorProps = {
  onSelectionChange?: (type: string, ids: string[]) => void;
  label?: string;
  selectOnly?: "userIds" | "batchIds";
  single?: boolean;
  defaultSelectionType?: SelectionType;
  defaultSelectedOptions?: string[];
};

export function TargetSelector({
  onSelectionChange,
  label = "Select Target...",
  selectOnly,
  single,
  defaultSelectedOptions,
  defaultSelectionType,
}: TargetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectionType, setSelectionType] = useState<SelectionType | null>(
    null
  );

  useEffect(() => {
    if (defaultSelectionType) setSelectionType(defaultSelectionType);
    if (defaultSelectedOptions) setSelectedOptions(defaultSelectedOptions);
    if (selectOnly) setSelectionType(selectOnly);
  }, [defaultSelectionType, defaultSelectedOptions]);

  useEffect(() => {
    if (selectionType && onSelectionChange) {
      onSelectionChange(selectionType, selectedOptions);
    }
  }, [selectionType, selectedOptions, onSelectionChange]);
  const popupRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Item[]>([]);

  const toggleOption = (value: string) => {
    if (selectionType === "all") return;
    if (single) {
      setSelectedOptions([value]);
      return;
    }
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((option) => option !== value)
        : [...prev, value]
    );
  };

  const handleSelectionTypeChange = (
    type: SelectionType,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    event.preventDefault();
    setSelectionType(type);
    setSelectedOptions(type === "all" ? ["all"] : []);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let items: Item[] = [];
    items.push({
      type: "all",
    });
    handleFetch(
      "/users?role=all",
      setLoading,
      (userIds: any[]) => {
        items.push({ type: "header", label: "People" });
        userIds.map((item) => {
          items.push({
            type: "userIds",
            value: item._id as string,
            label: item.name as string,
          });
        });
      },
      console.log
    );
    handleFetch(
      "/batches",
      setLoading,
      (batchIds: any[]) => {
        items.push({ type: "header", label: "Batches" });
        batchIds.map((batch) => {
          items.push({
            type: "batchIds",
            value: batch._id as string,
            label: batch.name as string,
          });
        });
      },
      console.log
    );
    setItems(items);
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter((item) => {
      if (item.type === "header" || item.type === "all") return false;
      // @ts-ignore
      return item.label.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm]);

  return (
    <div className="relative">
      {selectedOptions.map((option) => (
        <input type="hidden" name={selectionType || ""} value={option} />
      ))}

      <button
        className="border px-2 py-1 rounded"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        {selectionType && selectedOptions.length ? (
          <input
            required
            readOnly
            value={
              single
                ? items.filter((item) => item?.value === selectedOptions[0])[0]
                    ?.label
                : "Selected " +
                  (selectionType != "all" ? selectedOptions.length : "") +
                  " " +
                  selectionType
            }
          />
        ) : (
          <>
            {label}
            <input required className=" w-1" />
          </>
        )}
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="absolute mt-2 w-48 border rounded shadow-sm bg-white"
        >
          <div className="p-2 border-b border-gray-300">
            <select
              value={selectionType || ""}
              onChange={(e) =>
                handleSelectionTypeChange(e.target.value as SelectionType, e)
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="">Select type...</option>
              {selectOnly === "userIds" ? (
                <option value="userIds">People</option>
              ) : selectOnly == "batchIds" ? (
                <option value="batchIds">Batches</option>
              ) : (
                <>
                  <option value="all">All</option>
                  <option value="batchIds">Batches</option>
                  <option value="userIds">People</option>
                </>
              )}
            </select>
          </div>
          {selectionType != "all" && (
            <div className="p-2 border-b border-gray-300">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  e.preventDefault();
                  setSearchTerm(e.target.value);
                }}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          )}
          {selectionType && (
            <>
              <ul className="py-1 max-h-48 overflow-y-auto">
                {selectionType === "all" ? (
                  <li key="all" className="px-4 py-1">
                    <span>All selected</span>
                  </li>
                ) : (
                  filteredItems.map((item, index) => {
                    switch (item.type) {
                      case "header":
                        return (selectionType === "userIds" &&
                          item.label === "userIds") ||
                          (selectionType === "batchIds" &&
                            item.label === "batchIds") ? (
                          <li
                            key={index}
                            className="px-2 pt-1 py-0 text-xs text-gray-500"
                          >
                            {item.label}
                          </li>
                        ) : null;
                      case "userIds":
                        return selectionType === "userIds" ? (
                          <li
                            key={item.value}
                            className="px-4 py-1 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleOption(item.value);
                            }}
                          >
                            <span>{item.label}</span>
                            {selectedOptions.includes(item.value) && (
                              <span className="ml-2">✓</span>
                            )}
                          </li>
                        ) : null;
                      case "batchIds":
                        return selectionType === "batchIds" ? (
                          <li
                            key={item.value}
                            className="px-4 py-1 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleOption(item.value);
                            }}
                          >
                            <span>{item.label}</span>
                            {selectedOptions.includes(item.value) && (
                              <span className="ml-2">✓</span>
                            )}
                          </li>
                        ) : null;
                      default:
                        return null;
                    }
                  })
                )}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

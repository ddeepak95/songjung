import React, { useState, useEffect, useRef } from "react";

type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  id?: string;
  options: DropdownOption[];
  label?: string;
  defaultValue?: string;
  onSelect: (value: string) => void;
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  defaultValue,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] =
    useState<DropdownOption[]>(options);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (defaultValue) {
      const defaultOpt = options.find((opt) => opt.value === defaultValue);
      if (defaultOpt) setSelectedOption(defaultOpt);
    }
  }, [defaultValue, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchTerm("");
    setFilteredOptions(options);
  };

  const handleOptionClick = (option: DropdownOption) => {
    setSelectedOption(option);
    onSelect(option.value);
    toggleDropdown();
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 text-left text-white px-4 py-2 rounded w-full"
      >
        {selectedOption ? selectedOption.label : "Select an option"}
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-full rounded-md shadow-lg z-50">
          <div className="rounded-md bg-white shadow-xs">
            <input
              ref={searchRef}
              className="w-full px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
            />
            <div
              className="py-1 overflow-y-auto max-h-60"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {filteredOptions.map((option) => (
                <a
                  key={option.value}
                  onClick={(e) => {
                    e.preventDefault();
                    handleOptionClick(option);
                  }}
                  href="#"
                  className={`block px-4 py-2 text-sm leading-5 ${
                    option.value === selectedOption?.value
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  role="menuitem"
                >
                  {option.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

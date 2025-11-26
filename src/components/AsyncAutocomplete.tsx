import { useState, useEffect, useRef } from "react";
import { useDebouncedCallback } from "../hooks/useDebounce";

interface AsyncAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  fetchSuggestions: (
    query: string
  ) => Promise<Array<{ id: number; name: string }>>;
  placeholder?: string;
  label: string;
  required?: boolean;
}

type Suggestion = {
  id: number;
  name: string;
};

export default function AsyncAutocomplete({
  value,
  onChange,
  fetchSuggestions,
  placeholder,
  label,
  required = false,
}: AsyncAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = useDebouncedCallback(async (val: string) => {
    if (val?.length < 1) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await fetchSuggestions(val);
      setSuggestions(results);
      if (!results.some((item) => item.name === val)) {
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  useEffect(() => {
    fetchData(value);
  }, [fetchData, value]);

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
  };

  return (
    <div className="form-group" ref={wrapperRef}>
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div className="autocomplete-wrapper">
        <input
          type="text"
          className="form-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
        {isLoading && <span className="autocomplete-loading">Loading...</span>}
        {isOpen && suggestions.length > 0 && (
          <ul className="autocomplete-dropdown">
            {suggestions.map((item) => (
              <li
                key={item.id}
                className="autocomplete-item"
                onClick={() => handleSelect(item.name)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

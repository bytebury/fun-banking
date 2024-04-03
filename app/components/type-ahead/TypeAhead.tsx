import { useEffect, useRef, useState } from "react";
import styles from "./TypeAhead.module.scss";

type TypeAheadProps = {
  id: string;
  data: { displayText: string; value: any; searchText: string }[];
  children?: JSX.Element | string;
  name: string;
  onSelected: any;
};
export function TypeAhead({ id, data, children, name, onSelected }: TypeAheadProps): JSX.Element {
  const wrapperRef = useRef<HTMLElement>(null);
  const [filteredData, setFilteredData] = useState(data);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) && showSuggestions) {
        setShowSuggestions(false);
        onSelected(selectedValue);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onSelected, selectedValue, showSuggestions]);

  useEffect(() => {
    function handleBackspace(event: any) {
      if (selectedValue && showSuggestions && event.code === "Backspace") {
        setSelectedValue(null);
        setCurrentValue("");
        onSelected(null);
      }
    }

    document.addEventListener("keydown", handleBackspace);

    return () => {
      document.removeEventListener("keydown", handleBackspace);
    };
  }, [onSelected, selectedValue, showSuggestions]);

  function handleChange(event: any): void {
    const { value } = event.target;

    setCurrentValue(value);
    setFilteredData(
      data.filter(({ searchText }) => searchText.toLowerCase().includes(value.toLowerCase()))
    );
  }

  function handleSelection(event: any, data: any): void {
    event.preventDefault();

    setSelectedValue(data);
    setCurrentValue(data.displayText);
    setShowSuggestions(false);

    // Emit the event
    onSelected(data);
  }

  return (
    <div ref={wrapperRef as any}>
      <input
        className={showSuggestions ? styles.inputFocused : styles.input}
        id={id}
        name={name}
        type="text"
        onChange={handleChange}
        value={currentValue}
        onFocus={() => setShowSuggestions(true)}
        autoComplete="off"
      />
      <label htmlFor={id}>{children}</label>
      {showSuggestions && (
        <ul className={styles.listItems}>
          {filteredData.length > 0 &&
            filteredData.map((fd, index) => {
              return (
                <li key={index} className="relative">
                  <button onClick={(e) => handleSelection(e, fd)}>{fd.displayText}</button>
                </li>
              );
            })}
          {filteredData.length === 0 && (
            <div className="py-1 px-4 text-gray-400">No results, try typing something else.</div>
          )}
        </ul>
      )}
    </div>
  );
}

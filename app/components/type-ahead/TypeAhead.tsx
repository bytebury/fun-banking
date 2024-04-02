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
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

    // TODO: EMIT THE EVENT!
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
          {filteredData.map((fd, index) => {
            return (
              <li key={index} className="relative">
                <button onClick={(e) => handleSelection(e, fd)}>{fd.displayText}</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

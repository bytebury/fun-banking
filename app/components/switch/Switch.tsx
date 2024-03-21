import { useState } from "react";
import styles from "./Switch.module.scss";

type SwitchProps = {
  id: string;
  enabled?: boolean;
  onChange: (enabled: boolean) => void;
  children: any;
};

export function Switch({ id, enabled, onChange, children }: SwitchProps) {
  const [isEnabled, setIsEnabled] = useState(enabled || false);

  const handleToggle = (): void => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onChange(newValue);
  };

  return (
    <>
      <label className={styles.switch} htmlFor={id}>
        <input
          id={id}
          className={styles.switch}
          type="checkbox"
          onChange={handleToggle}
          checked={isEnabled}
        />
      </label>
      <label className="cursor-pointer" htmlFor={id}>
        {children}
      </label>
    </>
  );
}

import { Icon, MatIcon } from "../icons/MatIcon";
import styles from "./Notice.module.scss";

type NoticeParams = {
  icon?: Icon;
  type?: "default" | "error" | "info";
  children: any;
};

export function Notice({ icon, children, type }: NoticeParams) {
  return (
    <div className={`${styles.notice} ${styles[type ?? "default"]}`}>
      <MatIcon icon={icon ?? "rocket-launch-outline"} />
      {children}
    </div>
  );
}

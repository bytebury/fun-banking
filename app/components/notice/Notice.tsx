import { Icon, MatIcon } from "../mat-icon/MatIcon";
import "./Notice.scss";

type NoticeParams = {
  icon?: Icon;
  children: JSX.Element | string;
};

export function Notice({ icon, children }: NoticeParams) {
  return <div className="notice">{children}</div>;
}

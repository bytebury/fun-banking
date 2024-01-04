import { MatIcon } from "../mat-icon/MatIcon";
import "./TopAppBar.css";

export function TopAppBar() {
  return (
    <div className="top-bar-container">
      <div className="leading-icon">
        <button className="icon">
          <MatIcon icon="menu" />
        </button>
      </div>
      <h1 className="headline">Fun Banking</h1>
      <div className="trailing-icon"></div>
    </div>
  );
}

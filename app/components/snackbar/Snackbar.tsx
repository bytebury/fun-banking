"use client";

import "./Snackbar.scss";

export function Snackbar() {
  return (
    <div className="snackbar">
      <div className="content">
        Example
        <button className="shrink-0">{"Dismiss"}</button>
      </div>
    </div>
  );
}

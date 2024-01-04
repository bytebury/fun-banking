import { MatIcon } from "./components/mat-icon/MatIcon";
import { Notice } from "./components/notice/Notice";

export default function Home() {
  return (
    <main>
      <Notice>
        We are currently in the middle of developing... But wait what if they are very long/ ?
      </Notice>
      <button className="common filled">
        <MatIcon icon="add" />
        Go Home
      </button>
      <button className="common filled-tertiary">Hello World!</button>
      <button className="common filled-error">Hello World!</button>

      <button className="common outlined">Hello World!</button>
      <button className="text">Hello World!</button>

      <button className="icon filled">
        <MatIcon icon="add" />
      </button>
      <button className="icon filled-tonal">
        <i className="material-symbols-outlined">home</i>
      </button>
    </main>
  );
}

import LeftNav from "../organism/LeftNav";
import TopNav from "../organism/TopNav";

import "./Layout.css";

export default function () {
  return (
    <div>
      <TopNav />
      <div id="left-menu-container">
        <LeftNav />
      </div>
    </div>
  );
}

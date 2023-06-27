import LeftNav from "./component/organism/LeftNav";
import TopNav from "./topNav/TopNav";

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

import TopNav from "../../component/organism/TopNav";
import LeftMenu from "../../component/organism/LeftNav";

export default function () {
  return (
    <>
      <TopNav />
      <div id="left-menu-container">
        <LeftMenu />
      </div>
    </>
  );
}

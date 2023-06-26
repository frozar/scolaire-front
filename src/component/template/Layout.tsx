import TopNav from "../organism/TopNav";
import LeftNav from "../organism/LeftNav";

export interface LayoutProps {
  getDisplayedLeftMenu?: () => boolean;
  toggleDisplayedLeftMenu?: () => void;
}

export default function (props: LayoutProps) {
  return (
    <div>
      <TopNav />
      <LeftNav
        getDisplayedLeftMenu={props.getDisplayedLeftMenu}
        toggleDisplayedLeftMenu={props.toggleDisplayedLeftMenu}
      />
    </div>
  );
}

import { JSXElement, children } from "solid-js";
import LeftNav from "../organism/LeftNav";
import TopNav from "../organism/TopNav";

import "./Layout.css";

interface LayoutProps {
  children?: JSXElement;
}

export default function (props: LayoutProps) {
  const childs = children(() => props.children);

  return (
    <div id="layout">
      <LeftNav />

      <div id="app-container">
        <TopNav />

        {childs()}
      </div>
    </div>
  );
}

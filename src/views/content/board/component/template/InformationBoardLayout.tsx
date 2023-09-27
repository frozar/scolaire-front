import { JSXElement, children } from "solid-js";

import Breadcrumb from "../molecule/Breadcrumb";
import "./InformationBoardLayout.css";

export default function (props: { children: JSXElement }) {
  const child = children(() => props.children);

  return (
    <section id="information-board-layout">
      <Breadcrumb />
      {child()}
    </section>
  );
}

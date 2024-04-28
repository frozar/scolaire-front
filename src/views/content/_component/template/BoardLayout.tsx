import { JSXElement, children } from "solid-js";

import Breadcrumb from "../../board/component/molecule/Breadcrumb";
import "./BoardLayout.css";

export function BoardLayout(props: { children: JSXElement }) {
  const child = children(() => props.children);

  return (
    <section id="board-layout">
      <Breadcrumb />
      {child()}
    </section>
  );
}

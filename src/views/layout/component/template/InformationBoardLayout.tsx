import { JSXElement, children, createSignal } from "solid-js";
import FilAriane from "../atom/FilAriane";

import "./InformationBoardLayout.css";

export const [filAriane, setFilAriane] = createSignal<string>("Acceuil");

export default function (props: { children: JSXElement }) {
  const child = children(() => props.children);

  // return (
  //   <section id="information-board-layout">
  //     <FilAriane />
  //     {child()}
  //   </section>
  // );

  return (
    <section id="information-board-layout">
      <FilAriane />
      {child()}
    </section>
  );
}

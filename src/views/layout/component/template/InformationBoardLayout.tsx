import { JSXElement, children } from "solid-js";
import FilAriane, { setFilAriane } from "../atom/FilAriane";
import "./InformationBoardLayout.css";

export default function (props: { children: JSXElement }) {
  const fileariane = "Création d'une ligne";
  setFilAriane(fileariane);

  const child = children(() => props.children);

  return (
    <section id="information-board-layout">
      <FilAriane />
      {child()}
    </section>
  );
}

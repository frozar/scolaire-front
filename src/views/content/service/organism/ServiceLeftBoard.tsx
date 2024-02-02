import { JSXElement } from "solid-js";
import InputSearch from "../../schools/component/molecule/InputSearch";
import { ServiceLeftBoardContent } from "./ServiceLeftBoardContent";

import "./ServiceLeftBoard.css";

export function ServiceLeftBoard(): JSXElement {
  return (
    <div id="service-left-board">
      <div id="service-left-board-header">
        <div id="service-left-board-header-title">
          Liste des courses à assigner
        </div>
        <div id="service-left-board-searchbar">
          <InputSearch onInput={() => console.log("todo")} />
        </div>
      </div>
      <ServiceLeftBoardContent />
    </div>
  );
}

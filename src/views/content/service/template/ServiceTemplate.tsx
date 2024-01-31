import { JSXElement } from "solid-js";
import InputSearch from "../../schools/component/molecule/InputSearch";
import "./ServiceTemplate.css";

// TODO: Make components
export function ServiceTemplate(): JSXElement {
  return (
    <div>
      <div id="service-left-board">
        <div id="service-left-board-header">
          <div id="service-left-board-header-title">
            Liste des courses à assigner
          </div>
          {/* SearchBar */}
          <div id="service-left-board-searchbar">
            <InputSearch onInput={() => console.log("todo")} />
          </div>
        </div>
      </div>
    </div>
  );
}

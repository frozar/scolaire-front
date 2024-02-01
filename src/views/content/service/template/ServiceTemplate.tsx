import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
} from "@thisbeyond/solid-dnd";
import { JSXElement } from "solid-js";
import InputSearch from "../../schools/component/molecule/InputSearch";
import { ServiceLeftBoardContent } from "../organism/ServiceLeftBoardContent";
import "./ServiceTemplate.css";

// TODO: Make components
export function ServiceTemplate(): JSXElement {
  function onDragOver({ draggable, droppable }) {
    console.log("TODO");
  }

  function onDragEnd({ draggable, droppable }) {
    console.log("TODO");
  }
  return (
    <div>
      <DragDropProvider onDragOver={onDragOver} onDragEnd={onDragEnd}>
        <DragDropSensors />

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
          <ServiceLeftBoardContent />
        </div>
        <DragOverlay>
          {(draggable) => <div class="sortable">{draggable.id}</div>}
        </DragOverlay>
      </DragDropProvider>
    </div>
  );
}

import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
} from "@thisbeyond/solid-dnd";
import { JSXElement } from "solid-js";
import InputSearch from "../../schools/component/molecule/InputSearch";
import { ServiceTripCardDragged } from "../molecule/ServiceTripCardDragged";
import {
  DraggableTripType,
  ServiceLeftBoardContent,
  tripsWithoutService,
} from "../organism/ServiceLeftBoardContent";
import "./ServiceTemplate.css";

// TODO: Make components
export function ServiceTemplate(): JSXElement {
  function onDragOver({ draggable, droppable }) {
    console.log("TODO");
  }

  function onDragEnd({ draggable, droppable }) {
    console.log("TODO");
  }

  function tripCardDragged(tripId: number): DraggableTripType {
    return tripsWithoutService().filter(
      (tripWithoutService) => tripWithoutService.tripId == tripId
    )[0];
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
          {/* {(draggable) => <div class="sortable">{draggable.id}</div>} */}
          {(draggable) => (
            <ServiceTripCardDragged
              trip={tripCardDragged(draggable?.id as number)}
            />
          )}
        </DragOverlay>
      </DragDropProvider>
    </div>
  );
}

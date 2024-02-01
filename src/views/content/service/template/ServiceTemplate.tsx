import {
  DragDropProvider,
  DragDropSensors,
  DragEvent,
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

export function ServiceTemplate(): JSXElement {
  function onDragOver({ draggable, droppable }: DragEvent) {
    console.log("TODO", draggable, droppable);
  }

  function onDragEnd({ draggable, droppable }: DragEvent) {
    console.log("TODO", draggable, droppable);
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
            <div id="service-left-board-searchbar">
              <InputSearch onInput={() => console.log("todo")} />
            </div>
          </div>
          <ServiceLeftBoardContent />
        </div>
        <DragOverlay>
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

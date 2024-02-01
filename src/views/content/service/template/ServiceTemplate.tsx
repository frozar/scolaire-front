import {
  DragDropProvider,
  DragDropSensors,
  DragEvent,
  DragOverlay,
} from "@thisbeyond/solid-dnd";
import { JSXElement } from "solid-js";
import { ServiceTripCardDragged } from "../molecule/ServiceTripCardDragged";
import { ServiceLeftBoard } from "../organism/ServiceLeftBoard";
import {
  DraggableTripType,
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

        <ServiceLeftBoard />

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

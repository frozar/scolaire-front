import { Show, createSignal } from "solid-js";
import { DashboardBoardManager } from "../../dashboard/template/DashboardBoardManager";
import { BoardLayout } from "./BoardLayout";

export type MapBoardTags =
  | "dashboard"
  //   | "schools"
  //   | "school-details"
  //   | "school-grade-details"
  //   | "school-grade-add"
  //   | "school-grade-modify"
  //   | "stops"
  //   | "stop-details"
  //   | "trip"
  //   | "trip-draw"
  //   | "line"
  //   | "line-add"
  //   | "line-details"
  //   | "path-details"
  //   | "path-draw"
  | undefined;

export const [mapBoard, setMapBoard] = createSignal<MapBoardTags>(undefined);

export function MapBoardManager() {
  return (
    <section>
      <Show when={mapBoard()}>
        <BoardLayout>
          <DashboardBoardManager board={mapBoard()} />
        </BoardLayout>
      </Show>
    </section>
  );
}

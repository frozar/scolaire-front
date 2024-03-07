import { Show, createSignal } from "solid-js";
import { DashboardBoardManager } from "../../dashboard/template/DashboardBoardManager";
import { StopsBoardManager } from "../../stops/component/template/StopsBoardManager";
import { BoardLayout } from "./BoardLayout";

export type MapBoardTags =
  | "dashboard"
  | "stops"
  | "stop-details"
  //   | "schools"
  //   | "school-details"
  //   | "school-grade-details"
  //   | "school-grade-add"
  //   | "school-grade-modify"
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
          <StopsBoardManager board={mapBoard()} />
        </BoardLayout>
      </Show>
    </section>
  );
}

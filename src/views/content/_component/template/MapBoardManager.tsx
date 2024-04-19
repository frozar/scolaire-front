import { Show, createSignal } from "solid-js";
import { DashboardBoardManager } from "../../dashboard/template/DashboardBoardManager";
import { LinesBoardManager } from "../../line/template/LinesBoardManager";
import { PathsBoardManager } from "../../paths/template/PathsBoardManager";
import { SchoolsBoardManager } from "../../schools/component/template/SchoolsBoardManager";
import { StopsBoardManager } from "../../stops/component/template/StopsBoardManager";
import { TripsBoardManager } from "../../trips/template/TripsBoardManager";
import { BoardLayout } from "./BoardLayout";

export type MapBoardTags =
  | "dashboard"
  | "lines"
  | "line-details"
  | "line-add"
  | "line-edit"
  | "trip-details"
  | "trip-edit"
  | "stops"
  | "stop-add"
  | "stop-details"
  | "schools"
  | "school-add"
  | "school-details"
  | "school-grade-details"
  | "school-grade-add"
  | "school-grade-edit"
  | "paths"
  | "path-add"
  | "path-details"
  | "path-edit"
  | undefined;

export const [mapBoard, setMapBoard] = createSignal<MapBoardTags>(undefined);

export function MapBoardManager() {
  return (
    <section>
      <Show when={mapBoard()}>
        <BoardLayout>
          <DashboardBoardManager board={mapBoard()} />
          <StopsBoardManager board={mapBoard()} />
          <SchoolsBoardManager board={mapBoard()} />
          <PathsBoardManager board={mapBoard()} />
          <LinesBoardManager board={mapBoard()} />
          <TripsBoardManager board={mapBoard()} />
        </BoardLayout>
      </Show>
    </section>
  );
}

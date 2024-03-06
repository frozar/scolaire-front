import { createSignal } from "solid-js";
import { setSelectedMenu } from "../layout/menuItemFields";
import { setMapBoard } from "./_component/template/MapBoardManager";
import { changeBoard } from "./board/component/template/ContextManager";

export type ContentTags =
  | "dashboard"
  // | "schools"
  // | "school-details"
  // | "school-grade-details"
  // | "school-grade-add"
  // | "school-grade-modify"
  // | "stops"
  // | "stop-details"
  // | "trip"
  // | "trip-draw"
  // | "line"
  // | "line-add"
  // | "line-details"
  // | "path-details"
  // | "path-draw"
  | undefined;

export const [view, setView] = createSignal<ContentTags>(undefined);

export namespace ViewManager {
  export function dashboard() {
    setSelectedMenu("dashboard");
    setMapBoard("dashboard");
    //TODO to delete post refacto
    changeBoard(undefined);
    // MapElementUtils.deselectAllPointsAndBusTrips();
  }
}

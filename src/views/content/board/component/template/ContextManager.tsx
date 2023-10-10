import { Match, Switch, createEffect, createSignal } from "solid-js";

import ClasseBoard from "../../../schools/component/organism/ClasseBoard";
import SchoolsBoard from "../../../schools/component/organism/SchoolBoard";
import SchoolDetails from "../../../schools/component/organism/SchoolDetails";
import StopBoard from "../../../stops/component/organism/StopBoard";
import StopDetails from "../../../stops/component/organism/StopDetails";
import AddLineBoardContent from "../organism/AddLineBoardContent";
import BusLinesBoard from "../organism/BusLinesBoard";
import { BusCourseInformationBoardContent } from "../organism/CourseInformationBoardContent";
import CoursesBoard from "../organism/CoursesBoard";
import DrawModeBoardContent from "../organism/DrawModeBoardContent";
import InformationBoardLayout from "./InformationBoardLayout";

//TODO utiliser ou supprimer "schools" et "stops"
export type BoardTags =
  | "schools"
  | "school-details"
  | "school-class-add"
  | "school-class-modify"
  | "stops"
  | "stop-details"
  | "course"
  | "course-draw"
  | "line"
  | "line-add"
  | "line-details"
  | undefined;

export const [isInDrawMod, setIsDrawMod] = createSignal<boolean>(false);
export const toggleDrawMod = () => setIsDrawMod((bool) => !bool);

export const [onBoard, setOnBoard] = createSignal<BoardTags>("line");
export const changeBoard = (boardName: BoardTags) => setOnBoard(boardName);

export default function () {
  createEffect(() => {
    if (isInDrawMod()) {
      changeBoard("course-draw");
    } else {
      setOnBoard((prev) => {
        return prev == "course-draw" ? "line" : prev;
      });
    }
  });

  return (
    <section>
      <InformationBoardLayout>
        <Switch>
          <Match when={onBoard() == "line"}>
            {/* <CoursesBoard /> */}
            <BusLinesBoard />
          </Match>
          <Match when={onBoard() == "line-add"}>
            {/* <CoursesBoard /> */}
            <AddLineBoardContent />
          </Match>
          <Match when={onBoard() == "course"}>
            <CoursesBoard />
          </Match>
          <Match when={onBoard() == "course-draw"}>
            <DrawModeBoardContent />
          </Match>

          {/* Schools */}
          <Match when={onBoard() == "schools"}>
            <SchoolsBoard />
          </Match>

          <Match when={onBoard() == "school-details"}>
            <SchoolDetails />
          </Match>

          <Match
            when={
              onBoard() == "school-class-add" ||
              onBoard() == "school-class-modify"
            }
          >
            <ClasseBoard />
          </Match>

          {/* Stops */}
          <Match when={onBoard() == "stops"}>
            <StopBoard />
          </Match>

          <Match when={onBoard() == "stop-details"}>
            <StopDetails />
          </Match>

          <Match when={onBoard() == "line-details"}>
            <BusCourseInformationBoardContent />
          </Match>
        </Switch>
      </InformationBoardLayout>
    </section>
  );
}

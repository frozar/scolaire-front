import { Match, Switch } from "solid-js";
import { MapBoardTags } from "../../../_component/template/MapBoardManager";
import { GradeBoardDetails } from "../organism/GradeBoardDetails";
import { GradeEditBoard } from "../organism/GradeEditBoard";
import { SchoolDetails } from "./SchoolDetails";
import Schools from "./Schools";

export function SchoolsBoardManager(props: { board: MapBoardTags }) {
  return (
    <Switch>
      <Match when={props.board == "schools"}>
        <Schools />
      </Match>

      <Match when={props.board == "school-details"}>
        <SchoolDetails />
      </Match>

      <Match
        when={
          props.board == "school-grade-add" ||
          props.board == "school-grade-modify"
        }
      >
        <GradeEditBoard />
      </Match>

      <Match when={props.board == "school-grade-details"}>
        <GradeBoardDetails />
      </Match>
    </Switch>
  );
}

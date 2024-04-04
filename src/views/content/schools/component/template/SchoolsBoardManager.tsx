import { Match, Switch } from "solid-js";
import { MapBoardTags } from "../../../_component/template/MapBoardManager";
import { SchoolAdd } from "./SchoolAdd";
import { SchoolDetails } from "./SchoolDetails";
import { SchoolGradeAdd } from "./SchoolGradeAdd";
import { SchoolGradeDetails } from "./SchoolGradeDetails";
import { SchoolGradeEdit } from "./SchoolGradeEdit";
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

      <Match when={props.board == "school-add"}>
        <SchoolAdd />
      </Match>

      <Match when={props.board == "school-grade-details"}>
        <SchoolGradeDetails />
      </Match>

      <Match when={props.board == "school-grade-edit"}>
        <SchoolGradeEdit />
      </Match>

      <Match when={props.board == "school-grade-add"}>
        <SchoolGradeAdd />
      </Match>
    </Switch>
  );
}

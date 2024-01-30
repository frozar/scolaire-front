import { For, JSXElement, Show } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { setSchoolDetailsItem } from "../../../schools/component/organism/SchoolDetails";
import "./MapInformationPanel.css";
import { getSchools } from "./SchoolPoints";

export function MapInformationPanel(): JSXElement {
  // get schools that don't have calendar
  function schoolsWithoutCalendar() {
    return getSchools().filter((school) => !school.calendar);
  }

  // TODO: Fetch again school from getSchools() ?
  function onClickSchoolName(school: SchoolType): void {
    setSchoolDetailsItem(school);
    changeBoard("school-details");
    updatePointColor(school);
  }
  return (
    <div id="map-information-panel">
      <Show when={schoolsWithoutCalendar().length > 0}>
        {/* Put definitive color chosen in tailwind config file */}
        <CollapsibleElement
          title={schoolsWithoutCalendar().length + " écoles sans calendriers"}
          titleClass="text-orange-600"
          closedByDefault={() => true}
        >
          <For each={schoolsWithoutCalendar()}>
            {(school) => {
              return (
                <div
                  class="underline cursor-pointer"
                  onClick={() => onClickSchoolName(school)}
                >
                  {school.name}
                </div>
              );
            }}
          </For>
        </CollapsibleElement>
      </Show>
    </div>
  );
}

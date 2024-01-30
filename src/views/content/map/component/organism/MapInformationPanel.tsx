import { For, JSXElement, Show } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { setSchoolDetailsItem } from "../../../schools/component/organism/SchoolDetails";
import "./MapInformationPanel.css";
import { getSchools } from "./SchoolPoints";

export function MapInformationPanel(): JSXElement {
  function schoolsWithoutCalendar() {
    return getSchools().filter((school) => !school.calendar);
  }

  function onClickSchoolName(school: SchoolType): void {
    setSchoolDetailsItem(school);
    changeBoard("school-details");
    updatePointColor(school);
  }

  function thereIsInformationToDisplay(): boolean {
    if (schoolsWithoutCalendar().length > 0) return true;
    return false;
  }

  return (
    <Show when={thereIsInformationToDisplay()}>
      <div id="map-information-panel">
        <Show when={schoolsWithoutCalendar().length > 0}>
          <CollapsibleElement
            title={schoolsWithoutCalendar().length + " écoles sans calendrier"}
            titleClass="text-orange-base"
            closedByDefault={() => true}
          >
            <For each={schoolsWithoutCalendar()}>
              {(school) => {
                return (
                  <div
                    class="information-panel-school-link"
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
    </Show>
  );
}

import { For, JSXElement } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { setSchoolDetailsItem } from "../../../schools/component/organism/SchoolDetails";

export function MapInformationPanelItem(props: {
  schoolsToDisplay: SchoolType[];
  titleText: string;
}): JSXElement {
  function onClick(school: SchoolType): void {
    setSchoolDetailsItem(school);
    changeBoard("school-details");
    updatePointColor(school);
  }
  return (
    <CollapsibleElement
      title={props.schoolsToDisplay.length + " " + props.titleText}
      titleClass="text-orange-base"
      closedByDefault={() => true}
    >
      <For each={props.schoolsToDisplay}>
        {(school) => {
          return (
            <div
              class="information-panel-school-link"
              onClick={() => onClick(school)}
            >
              {school.name}
            </div>
          );
        }}
      </For>
    </CollapsibleElement>
  );
}

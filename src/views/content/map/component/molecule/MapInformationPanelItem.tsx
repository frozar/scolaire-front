import { For, JSXElement } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import { ViewManager } from "../../../ViewManager";
import CollapsibleElement from "../../../line/atom/CollapsibleElement";

export function MapInformationPanelItem(props: {
  schoolsToDisplay: SchoolType[];
  titleText: string;
}): JSXElement {
  function onClick(school: SchoolType): void {
    ViewManager.schoolDetails(school);
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

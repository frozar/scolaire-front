import { For, Show } from "solid-js";

import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { setStopSelected, stopSelected } from "./AddLineBoardContent";
import "./CollapsibleCheckableElement.css";
import CollapsibleElement from "./CollapsibleElement";

export type AssociatedItem = { stopItem: StopType; done: boolean };

export default function (props: { school: SchoolType }) {
  function classInStopAndSchool(stop_elem: StopType) {
    const allclassIDInSchool = props.school.classes.map(
      (classe) => classe.id
    ) as number[];

    const allClassIdInStop = stop_elem.associated.map(
      (associated_item) => associated_item.classId
    );
    const intersectionClasses = allclassIDInSchool.filter((classId) =>
      allClassIdInStop.includes(classId)
    );
    return intersectionClasses.length > 0;
  }

  return (
    <CollapsibleElement title={props.school.name}>
      <For each={stopSelected()}>
        {(stop_elem, i) => {
          return (
            <Show when={classInStopAndSchool(stop_elem.stopItem)}>
              <div class="flex items-center">
                <input
                  id="comments"
                  name="comments"
                  type="checkbox"
                  checked={stop_elem.done}
                  onChange={(e) => {
                    const prev = [...stopSelected()];
                    prev[i()] = { ...prev[i()], done: e.currentTarget.checked };
                    setStopSelected(prev);
                  }}
                  class="h-4 w-5 mr-4 rounded border-gray-300 text-green-base focus:ring-green-base"
                />
                <p>{stop_elem.stopItem.name}</p>
              </div>
            </Show>
          );
        }}
      </For>
    </CollapsibleElement>
  );
}

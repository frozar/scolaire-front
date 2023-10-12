import { For, Show } from "solid-js";

import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { setStopSelected, stopSelected } from "./AddLineBoardContent";
import "./CollapsibleCheckableElement.css";
import CollapsibleElement from "./CollapsibleElement";

export type AssociatedItem = { associated: StopType; done: boolean };

export default function (props: { school: SchoolType }) {
  return (
    <CollapsibleElement title={props.school.name}>
      <For each={stopSelected()}>
        {(school_elem, i) => {
          return (
            <Show
              when={props.school.associated
                .map((value) => value.id)
                .includes(school_elem.associated.id)}
            >
              <div class="flex items-center">
                <input
                  id="comments"
                  name="comments"
                  type="checkbox"
                  checked={school_elem.done}
                  onChange={(e) => {
                    const prev = [...stopSelected()];
                    prev[i()] = { ...prev[i()], done: e.currentTarget.checked };
                    setStopSelected(prev);
                  }}
                  class="h-4 w-5 mr-4 rounded border-gray-300 text-green-base focus:ring-green-base"
                />
                <p>{school_elem.associated.name}</p>
              </div>
            </Show>
          );
        }}
      </For>
    </CollapsibleElement>
  );
}

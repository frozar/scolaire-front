import { For, Show, onMount } from "solid-js";

import { SetStoreFunction } from "solid-js/store";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import "./CollapsibleCheckableElement.css";
import CollapsibleElement from "./CollapsibleElement";

export type AssociatedItem = { associated: AssociatedPointType; done: boolean };

export default function (props: {
  school: SchoolType;
  stopSelected: AssociatedItem[];
  setStopSelected: SetStoreFunction<AssociatedItem[]>;
}) {
  onMount(() => {
    props.setStopSelected(
      props.school.associated.map((elem) => {
        return { associated: elem, done: true };
      })
    );
  });

  return (
    <CollapsibleElement title={props.school.name}>
      <For each={props.stopSelected}>
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
                    props.setStopSelected(i(), "done", e.currentTarget.checked);
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

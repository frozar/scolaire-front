import { For } from "solid-js";
import CollapsibleElement from "../../board/component/organism/CollapsibleElement";
import { CheckableElement } from "../atom/CheckableElement";

type CollapsibleCheckableListType = {
  title: string;
  displayQuantity: boolean;
  elements: CheckableElementType[];
};

export function CheckableElementList(props: CollapsibleCheckableListType) {
  return (
    <CollapsibleElement title={props.title}>
      <For each={props.elements}>
        {(elem) => {
          return (
            <CheckableElement
              name={elem.name}
              id={elem.id}
              checked={elem.checked}
              onChange={elem.onChange}
              displayQuantity={props.displayQuantity}
            />
          );
        }}
      </For>
    </CollapsibleElement>
  );
}

type CheckableElementType = {
  name: string;
  id: number;
  checked: boolean;
  onChange: () => void;
};

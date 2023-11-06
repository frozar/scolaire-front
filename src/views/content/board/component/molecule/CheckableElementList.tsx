import { For } from "solid-js";
import {
  CheckableElement,
  CheckableElementType,
} from "../atom/CheckableElement";
import CollapsibleElement from "../organism/CollapsibleElement";

type CollapsibleCheckableListType = {
  title: string;
  content: CheckableElementType[];
};

export function CheckableElementList(props: CollapsibleCheckableListType) {
  return (
    <CollapsibleElement title={props.title}>
      <For each={props.content}>
        {(elem, i) => {
          return <CheckableElement content={elem} indice={i()} />;
        }}
      </For>
    </CollapsibleElement>
  );
}

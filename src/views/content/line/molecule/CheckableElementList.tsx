import { For, createSignal, onMount } from "solid-js";
import { CheckableElement } from "../atom/CheckableElement";
import CollapsibleElement from "../atom/CollapsibleElement";

type CollapsibleCheckableListType = {
  title: string;
  displayQuantity: boolean;
  elements: CheckableElementType[];
};

export function CheckableElementList(props: CollapsibleCheckableListType) {
  const [allChecked, setAllChecked] = createSignal(false);

  onMount(() => {
    props.elements.every((elem) => {
      if (!elem.checked) {
        setAllChecked(false);
        return false;
      }
      setAllChecked(true);
      return true;
    });
  });

  function checkOrUncheckAll() {
    if (allChecked()) {
      props.elements.forEach((elem) => {
        if (elem.checked) elem.onChange();
      });
      setAllChecked(false);
    } else {
      props.elements.forEach((elem) => {
        if (!elem.checked) elem.onChange();
      });
      setAllChecked(true);
    }
  }

  function updateAllCheck(currentElem: CheckableElementType) {
    currentElem.onChange();
    props.elements.every((elem) => {
      if (!elem.checked) {
        setAllChecked(false);
        return false;
      }
      setAllChecked(true);
      return true;
    });
  }

  return (
    <CollapsibleElement title={props.title}>
      <CheckableElement
        name="Tout sélectionner"
        checked={allChecked()}
        id={0}
        onChange={checkOrUncheckAll}
        displayQuantity={false}
      />
      <For each={props.elements}>
        {(elem) => {
          return (
            <CheckableElement
              name={elem.name}
              id={elem.id}
              checked={elem.checked}
              onChange={() => updateAllCheck(elem)}
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

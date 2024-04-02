import { Accessor, For, Setter } from "solid-js";
import { SchoolUtils } from "../../../../../utils/school.utils";
import CollapsibleElement from "../../../line/atom/CollapsibleElement";
import { DiffEnum, UncheckedElementType } from "./ImportDiff";

import { StopUtils } from "../../../../../utils/stop.utils";
import { DiffCheckbox } from "../atom/DiffCheckbox";
import { CsvEnum, csvType } from "./ImportSelection";

interface DiffCollapsibleProps {
  uncheckedValues: Accessor<UncheckedElementType>;
  setter: Setter<UncheckedElementType>;
  title: string;
  items: (number | string)[];
  diffType: DiffEnum;
}

export function DiffCollapsible(props: DiffCollapsibleProps) {
  function isDisabled(items: number | string) {
    if (props.diffType != DiffEnum.deleted) return false;

    if (props.uncheckedValues()["deleted"].includes(items)) return true;

    return false;
  }
  function collapsibleElementTitle(): string {
    return props.title + " " + props.items.length;
  }
  return (
    <>
      <CollapsibleElement
        title={collapsibleElementTitle()}
        closedByDefault={() => true}
      >
        <For each={props.items}>
          {(item) => {
            const disable = isDisabled(item);

            let label: string;
            if (props.diffType == DiffEnum.added) label = item as string;
            else if (csvType() == CsvEnum.schools) {
              label = SchoolUtils.getName(item as number);
            } else label = StopUtils.getName(item as number);

            return (
              <DiffCheckbox
                item={item}
                label={label}
                disable={disable}
                diffType={props.diffType}
                setter={props.setter}
              />
            );
          }}
        </For>
      </CollapsibleElement>
    </>
  );
}

import { Accessor, For, Setter } from "solid-js";
import { SchoolUtils } from "../../../../../utils/school.utils";
import CollapsibleElement from "../organism/CollapsibleElement";
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
  function isDisabled(school: number | string) {
    if (props.diffType != DiffEnum.deleted) return false;

    if (props.uncheckedValues()["deleted"].includes(school)) return true;

    return false;
  }

  return (
    <>
      <CollapsibleElement title={props.title}>
        <For each={props.items}>
          {(item) => {
            const disable = isDisabled(item);

            let label: string | number;
            if (props.diffType == DiffEnum.added) label = item;
            else if (csvType() == CsvEnum.schools) {
              label = SchoolUtils.getName(item as number);
            } else label = StopUtils.getName(item as number);

            return (
              <DiffCheckbox
                item={item}
                label={label as string}
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

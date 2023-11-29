import { Accessor, For, JSXElement, Match, Setter, Switch } from "solid-js";
import { StudentDiffType } from "../../../../../utils/csv.utils";
import { DiffCheckboxStudent } from "../atom/DiffCheckboxStudent";
import CollapsibleElement from "../organism/CollapsibleElement";
import { DiffEnum } from "./ImportDiff";
import { UncheckedStudents } from "./ImportDiffStudents";
import { studentDiff } from "./ImportSelection";

type StudentDiffCollapsibleProps = {
  uncheckedValues: Accessor<UncheckedStudents>;
  setUncheckedValues: Setter<UncheckedStudents>;
  diffType: DiffEnum;
};

export function StudentDiffCollapsible(
  props: StudentDiffCollapsibleProps
): JSXElement {
  const title =
    props.diffType == DiffEnum.added
      ? "Ajouter"
      : props.diffType == DiffEnum.modified
      ? "Modifier"
      : "Supprimer";

  return (
    <>
      <CollapsibleElement title={title}>
        <Switch>
          <Match when={props.diffType == DiffEnum.added}>
            <For each={(studentDiff() as StudentDiffType).added}>
              {(item) => {
                return (
                  <DiffCheckboxStudent
                    item={item}
                    label={
                      item.stop_name +
                      " | " +
                      item.grade_name +
                      " | " +
                      item.quantity
                    }
                    diffType={props.diffType}
                    setter={props.setUncheckedValues}
                  />
                );
              }}
            </For>
          </Match>

          <Match when={props.diffType == DiffEnum.modified}>
            <div>TEST modified</div>
          </Match>

          <Match when={props.diffType == DiffEnum.deleted}>
            <div>TEST deleted</div>
          </Match>
        </Switch>
      </CollapsibleElement>
    </>
  );
}

import { Accessor, For, JSXElement, Match, Setter, Switch } from "solid-js";
import { AssociatedUtils } from "../../../../../utils/associated.utils";
import { StudentDiffType } from "../../../../../utils/csv.utils";
import CollapsibleElement from "../../../line/atom/CollapsibleElement";
import { DiffCheckboxStudent } from "../atom/DiffCheckboxStudent";
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
  function getTitle(diffType: DiffEnum): string {
    return diffType == DiffEnum.added
      ? "Ajouter " + studentDiff()?.added.length
      : diffType == DiffEnum.modified
      ? "Modifier " + studentDiff()?.modified.length
      : "Supprimer " + studentDiff()?.deleted.length;
  }

  return (
    <>
      {/* TODO: Enhance visual and refactor */}
      <CollapsibleElement
        title={getTitle(props.diffType)}
        closedByDefault={() => true}
      >
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
            <For each={(studentDiff() as StudentDiffType).modified}>
              {(item) => {
                return (
                  <DiffCheckboxStudent
                    item={item}
                    label={
                      AssociatedUtils.getStopName(item.id as number) +
                      " | " +
                      AssociatedUtils.getGradeName(item.id as number) +
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

          <Match when={props.diffType == DiffEnum.deleted}>
            <For each={(studentDiff() as StudentDiffType).deleted}>
              {(itemId) => {
                return (
                  <DiffCheckboxStudent
                    item={itemId}
                    label={
                      AssociatedUtils.getStopName(itemId) +
                      " | " +
                      AssociatedUtils.getGradeName(itemId) +
                      " | " +
                      AssociatedUtils.getQuantity(itemId)
                    }
                    diffType={props.diffType}
                    setter={props.setUncheckedValues}
                  />
                );
              }}
            </For>
          </Match>
        </Switch>
      </CollapsibleElement>
    </>
  );
}

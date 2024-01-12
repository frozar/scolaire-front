import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { SchoolDetailUtils } from "../../../../../utils/school-details.utils";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import { changeBoard } from "../../../board/component/template/ContextManager";
import SchoolDetailsHeader from "../molecule/SchoolDetailsHeader";
import { SchoolDetailsContent } from "./SchoolDetailsContent";
import { SchoolDetailsPanels } from "./SchoolDetailsPanels";

export const [schoolDetailsItem, setSchoolDetailsItem] =
  createSignal<SchoolType>();
export const [schoolDetailEditing, setSchoolDetailEditing] =
  createSignal<boolean>(false);

export default function () {
  onMount(() => {
    if (schoolDetailsItem() == undefined) {
      changeBoard("schools");
      MapElementUtils.deselectAllPointsAndBusTrips();
    }
  });

  onCleanup(() => setSchoolDetailEditing(false));
  return (
    <section>
      <SchoolDetailsHeader school={schoolDetailsItem() as SchoolType} />

      <SchoolDetailsContent />

      <Show
        when={!schoolDetailEditing()}
        fallback={
          <BoardFooterActions
            nextStep={{
              callback: SchoolDetailUtils.edit,
              label: "Valider",
            }}
            previousStep={{
              callback: () => setSchoolDetailEditing(false),
              label: "Annuler",
            }}
          />
        }
      >
        <SchoolDetailsPanels />
      </Show>
    </section>
  );
}

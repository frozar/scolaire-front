import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { HoursType } from "../../../../../_entities/_utils.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { SchoolService } from "../../../../../_services/school.service";
import { SchoolStore } from "../../../../../_stores/school.store";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { ViewManager } from "../../../ViewManager";
import { setDisplaySchools } from "../../../_component/organisme/SchoolPoints";
import { setMapOnClick } from "../../../_component/template/MapContainer";
import BoardTitle from "../../../board/component/atom/BoardTitle";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import { SchoolAddContent } from "../organism/SchoolAddContent";

export function SchoolAdd() {
  const [newSchool, setNewSchool] = createSignal<SchoolType>({} as SchoolType);
  const [newHours, setNewHours] = createSignal<HoursType>(
    TimeUtils.defaultHours()
  );
  const [canSubmit, setCanSubmit] = createSignal(false);

  onMount(() => {
    setMapOnClick(() => setLocation);
  });

  onCleanup(() => {
    setMapOnClick(undefined);
  });

  function setLocation(e: L.LeafletMouseEvent) {
    setNewSchool((prev) => {
      return { ...prev, lat: e.latlng.lat, lon: e.latlng.lng };
    });
    setDisplaySchools([newSchool()]);
  }

  createEffect(() => {
    if (
      !newSchool().calendar ||
      !newSchool().name ||
      !newSchool().lat ||
      !newSchool().waitingTime ||
      !newHours().endHourComing ||
      !newHours().endHourGoing ||
      !newHours().startHourComing ||
      !newHours().startHourGoing
    )
      return setCanSubmit(false);
    setCanSubmit(true);
  });

  async function submitSchool() {
    setNewSchool((prev) => {
      return { ...prev, hours: newHours() };
    });
    enableSpinningWheel();
    const createdSchool: SchoolType = await SchoolService.create(newSchool());
    disableSpinningWheel();
    SchoolStore.add(createdSchool);
    ViewManager.schools();
    addNewGlobalSuccessInformation("L'école a été crée");
  }

  return (
    <section>
      <header class="my-6">
        <BoardTitle title="Ajouter une école" />
      </header>
      <div>
        <SchoolAddContent
          hours={newHours()}
          hoursSetter={setNewHours}
          school={newSchool()}
          schoolSetter={setNewSchool}
        />
        <BoardFooterActions
          nextStep={{
            callback: submitSchool,
            disable: !canSubmit(),
            label: "Valider",
          }}
          previousStep={{
            callback: ViewManager.schools,
            label: "Annuler",
          }}
        />
      </div>
    </section>
  );
}

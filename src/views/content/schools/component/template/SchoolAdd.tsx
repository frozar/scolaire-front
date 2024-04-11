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
import { setWayLineColor } from "../../../_component/molecule/WayLine";
import { setDisplayBusStops } from "../../../_component/organisme/BusStopPoints";
import { setDisplayWays } from "../../../_component/organisme/Ways";
import { setMapOnClick } from "../../../_component/template/MapContainer";
import BoardTitle from "../../../board/component/atom/BoardTitle";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import { BusStopsMenu } from "../../../busStops/organism/BusStopsMenu";
import { COLOR_BLUE_BASE } from "../../../map/constant";
import { loadWays } from "../../../paths/template/Paths";
import { SchoolAddContent } from "../organism/SchoolAddContent";

export function SchoolAdd() {
  const [newSchool, setNewSchool] = createSignal<SchoolType>({} as SchoolType);
  const [newHours, setNewHours] = createSignal<HoursType>(
    TimeUtils.defaultHours()
  );
  const [canSubmit, setCanSubmit] = createSignal(false);

  onMount(async () => {
    await loadWays();
    setWayLineColor(COLOR_BLUE_BASE);
  });

  onCleanup(() => {
    setDisplayBusStops([]);
    setDisplayWays([]);
    setMapOnClick(undefined);
  });

  createEffect(() => {
    if (
      !newSchool().calendar ||
      !newSchool().name ||
      !newSchool().lat ||
      !newSchool().waitingTime ||
      !newSchool().busStops ||
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
        <BusStopsMenu schoolSetter={setNewSchool} isSchool item={newSchool()} />
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

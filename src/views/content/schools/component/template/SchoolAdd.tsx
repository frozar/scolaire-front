import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { HoursType } from "../../../../../_entities/_utils.entity";
import { BusStopType } from "../../../../../_entities/busStops.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { BusStopService } from "../../../../../_services/busStop.service";
import { SchoolService } from "../../../../../_services/school.service";
import { SchoolStore } from "../../../../../_stores/school.store";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { ViewManager } from "../../../ViewManager";
import { setDisplayBusStops } from "../../../_component/organisme/BusStopPoints";
import { setDisplayWays } from "../../../_component/organisme/Ways";
import { setMapOnClick } from "../../../_component/template/MapContainer";
import BoardTitle from "../../../board/component/atom/BoardTitle";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import { BusStopsMenu } from "../../../busStops/organism/BusStopsMenu";
import { loadWays } from "../../../paths/template/Paths";
import { SchoolAddContent } from "../organism/SchoolAddContent";

export function SchoolAdd() {
  const [newSchool, setNewSchool] = createSignal<SchoolType>({} as SchoolType);
  const [newHours, setNewHours] = createSignal<HoursType>(
    TimeUtils.defaultHours()
  );
  const [canSubmit, setCanSubmit] = createSignal(false);
  const [busStopList, setBusStopList] = createSignal<BusStopType[]>([]);

  onMount(async () => {
    await loadWays();
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
      !newHours().endHourComing ||
      !newHours().endHourGoing ||
      !newHours().startHourComing ||
      !newHours().startHourGoing ||
      busStopList().length <= 0
    )
      return setCanSubmit(false);
    setCanSubmit(true);
  });

  async function createBusStops() {
    const busStopsId: number[] = [];
    busStopList().forEach(async (stop) => {
      const createdBusStop = await BusStopService.create(stop);
      busStopsId.push(createdBusStop.id as number);
    });
    return busStopsId;
  }

  async function submitSchool() {
    setNewSchool((prev) => {
      return { ...prev, hours: newHours() };
    });
    enableSpinningWheel();

    const b = await createBusStops();

    setNewSchool((prev) => {
      return { ...prev, busStops: b };
    });

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
        <BusStopsMenu
          isAdding
          setAddBusStop={setBusStopList}
          isSchool
          item={newSchool()}
          itemSetter={setNewSchool}
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

import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import { StopService } from "../../../../../_services/stop.service";
import { StopStore } from "../../../../../_stores/stop.store";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { ViewManager } from "../../../ViewManager";
import { setMapOnClick } from "../../../_component/template/MapContainer";
import BoardTitle from "../../../board/component/atom/BoardTitle";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import { BusStopsMenu } from "../../../busStops/organism/BusStopsMenu";
import { loadWays } from "../../../paths/template/Paths";
import { StopAddContent } from "../organism/StopAddContent";

export function StopAdd() {
  const [newStop, setNewStop] = createSignal<StopType>({} as StopType);
  const [canSubmit, setCanSubmit] = createSignal(false);

  onMount(async () => {
    await loadWays();
  });

  onCleanup(() => {
    setMapOnClick(undefined);
  });

  createEffect(() => {
    if (!newStop().name || !newStop().lat || !newStop().waitingTime)
      return setCanSubmit(false);
    setCanSubmit(true);
  });

  async function submitStop() {
    enableSpinningWheel();
    const createdStop: StopType = await StopService.create(newStop());
    disableSpinningWheel();
    StopStore.add(createdStop);
    ViewManager.stops();
    addNewGlobalSuccessInformation("L'arrêt a été crée");
  }

  return (
    <section>
      <header>
        <BoardTitle title="Ajouter un arrêt" />
      </header>
      <div>
        <StopAddContent stop={newStop()} stopSetter={setNewStop} />
        <BusStopsMenu
          isSchool={false}
          item={newStop()}
          stopSetter={setNewStop}
        />
        <BoardFooterActions
          nextStep={{
            callback: submitStop,
            disable: !canSubmit(),
            label: "Valider",
          }}
          previousStep={{
            callback: ViewManager.stops,
            label: "Annuler",
          }}
        />
      </div>
    </section>
  );
}

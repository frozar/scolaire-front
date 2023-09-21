import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { getBusLines } from "../../../map/component/organism/BusLines";
import LinesList from "../../../schools/component/organism/LinesList";
import EditStop from "../molecul/EditStop";
import StopDetailsHeader from "../molecul/StopDetailsHeader";
import StopDetailsPanelsButton from "../molecul/StopDetailsPanelsButton";
import SchoolList from "./SchoolList";
import "./StopDetails.css";

export const [stopDetailsItem, setStopDetailsItem] = createSignal<StopType>();

export enum StopPanels {
  classes = "schools",
  lines = "lines",
}

export default function () {
  const [onPanel, setOnPanel] = createSignal<StopPanels>(StopPanels.classes);
  const [editItem, setEditItem] = createSignal<boolean>(false);

  onMount(() => {
    if (stopDetailsItem() == undefined) {
      changeBoard("schools");
      MapElementUtils.deselectAllPointsAndBusLines();
    }
  });

  const toggleEditItem = () => setEditItem((bool) => !bool);

  function getStopLines() {
    const lines = [];

    for (const line of getBusLines()) {
      const _line = line.points.filter((l) => l.id == stopDetailsItem()?.id);
      if (_line.length > 0) lines.push(line);
    }

    return lines;
  }

  return (
    <section>
      <StopDetailsHeader stop={stopDetailsItem() as StopType} />

      <p>TODO élèves</p>

      <div class="stop-details-actions">
        <StopDetailsPanelsButton
          onPanel={onPanel}
          setOnPanel={setOnPanel}
          NbSchool={stopDetailsItem()?.associated.length as number}
          NbLines={getStopLines().length}
        />

        <Show when={onPanel() == "schools"}>
          <ButtonIcon icon={<PlusIcon />} onClick={toggleEditItem} />
        </Show>
      </div>

      <div class="content mt-2">
        <Switch>
          <Match when={onPanel() == StopPanels.classes}>
            <SchoolList
              schools={stopDetailsItem()?.associated as AssociatedPointType[]}
            />

            <Show when={editItem()}>
              <EditStop close={toggleEditItem} />
            </Show>
          </Match>
          <Match when={onPanel() == StopPanels.lines}>
            <LinesList lines={getStopLines()} />
          </Match>
        </Switch>
      </div>
    </section>
  );
}

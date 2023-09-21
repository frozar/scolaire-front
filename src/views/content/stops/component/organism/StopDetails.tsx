import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { getBusLines } from "../../../map/component/organism/BusLines";
import LinesList from "../../../schools/component/organism/LinesList";
import StopDetailsHeader from "../molecul/StopDetailsHeader";
import StopDetailsPanelsButton from "../molecul/StopDetailsPanelsButton";
import SchoolList from "./SchoolList";
import "./StopDetails.css";

export const [stopDetailsItem, setStopDetailsItem] = createSignal<StopType>();

export enum Panels {
  classes = "schools",
  lines = "lines",
}

function EditSchoolItem() {
  return (
    <div>
      <input class="input-form" type="text" />

      <div class="flex">
        <input class="input-form" type="text" />
        <input class="input-form" type="text" />
      </div>
    </div>
  );
}

export default function () {
  const [onPanel, setOnPanel] = createSignal<Panels>(Panels.classes);

  onMount(() => {
    if (stopDetailsItem() == undefined) {
      changeBoard("schools");
    }

    console.log(getStopLines());
  });

  function addSchool() {
    console.log("add school to this stop");
  }

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
        />

        <Show when={onPanel() == "schools"}>
          <ButtonIcon icon={<PlusIcon />} onClick={addSchool} />
        </Show>
      </div>

      <div class="content mt-2">
        <Switch>
          <Match when={onPanel() == Panels.classes}>
            <SchoolList
              schools={stopDetailsItem()?.associated as AssociatedPointType[]}
            />

            <EditSchoolItem />
          </Match>
          <Match when={onPanel() == Panels.lines}>
            <LinesList lines={getStopLines()} />
          </Match>
        </Switch>
      </div>
    </section>
  );
}

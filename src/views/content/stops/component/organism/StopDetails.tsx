import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import StopDetailsHeader from "../molecul/StopDetailsHeader";
import StopDetailsPanelsButton from "../molecul/StopDetailsPanelsButton";
import SchoolList from "./SchoolList";
import "./StopDetails.css";

export const [stopDetailsItem, setStopDetailsItem] = createSignal<StopType>();

export enum Panels {
  classes = "schools",
  lines = "lines",
}

export default function () {
  const [onPanel, setOnPanel] = createSignal<Panels>(Panels.classes);

  onMount(() => {
    if (stopDetailsItem() == undefined) {
      changeBoard("schools");
    }
  });

  function addSchool() {
    console.log("add school to this stop");
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
          </Match>
          <Match when={onPanel() == Panels.lines}>
            {/* <LinesList /> */}
            list des lignes associé
          </Match>
        </Switch>
      </div>
    </section>
  );
}

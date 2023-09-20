import { Match, Switch, createSignal, onMount } from "solid-js";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import { StopType } from "../../../../../_entities/stop.entity";
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

  return (
    <section>
      <StopDetailsHeader stop={stopDetailsItem() as StopType} />

      <p>TODO élèves</p>

      <div class="content mt-2">
        <StopDetailsPanelsButton
          onPanel={onPanel}
          setOnPanel={setOnPanel}
          NbSchool={stopDetailsItem()?.associated.length as number}
        />
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

import { Match, Switch, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import { getTrips } from "../../../../_stores/trip.store";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import { DashboardAllotment } from "../molecule/DashboardAllotment";
import { DashboardSchool } from "../molecule/DashboardSchool";

export function Dashboard() {
  const [selectedFilter, setSelectedFilter] = createSignal(0);

  onMount(() => {
    setMapData(getStops(), getSchools(), getTrips());
  });
  onCleanup(() => {
    setMapData([], [], []);
  });

  return (
    <div class="px-10 w-full bg-white">
      <div class="h-[calc(100vh-60px)]">
        <div class="pt-5 mb-3">Dashboard (TODO)</div>
        <LabeledInputSelect
          defaultValue={selectedFilter()}
          label="Vue"
          onChange={setSelectedFilter}
          options={[
            { text: "Vue Globale", value: 0 },
            { text: "Par Lot", value: 1 },
            { text: "Par Etablissement", value: 2 },
          ]}
        />
        <Switch>
          <Match when={selectedFilter() == 0}>
            <div>wot</div>
          </Match>
          <Match when={selectedFilter() == 1}>
            <DashboardAllotment />
          </Match>
          <Match when={selectedFilter() == 2}>
            <DashboardSchool />
          </Match>
        </Switch>
      </div>
    </div>
  );
}

function setMapData(
  stops: StopType[],
  schools: SchoolType[],
  trips: TripType[]
) {
  setDisplayStops(stops);
  setDisplaySchools(schools);
  setDisplayTrips(trips);
}

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
import { DashboardGlobal } from "../molecule/DashboardGlobal";
import { DashboardSchool } from "../molecule/DashboardSchool";

enum DashboardViewEnum {
  global,
  allotment,
  school,
}

export function Dashboard() {
  const [selectedFilter, setSelectedFilter] = createSignal(
    DashboardViewEnum.global
  );

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
            { text: "Vue Globale", value: DashboardViewEnum.global },
            { text: "Vue par Lot", value: DashboardViewEnum.allotment },
            { text: "Vue par Etablissement", value: DashboardViewEnum.school },
          ]}
        />
        <Switch>
          <Match when={selectedFilter() == DashboardViewEnum.global}>
            <DashboardGlobal />
          </Match>
          <Match when={selectedFilter() == DashboardViewEnum.allotment}>
            <DashboardAllotment />
          </Match>
          <Match when={selectedFilter() == DashboardViewEnum.school}>
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

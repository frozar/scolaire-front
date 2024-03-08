import { onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import { getTrips } from "../../../../_stores/trip.store";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";

export function Dashboard() {
  onMount(() => {
    setMapData(getStops(), getSchools(), getTrips());
  });
  onCleanup(() => {
    setMapData([], [], []);
  });

  return (
    <div class="px-10 w-full bg-white">
      <div class="h-[calc(100vh-60px)]">
        <div class="pt-5 mb-3">Dashboard (TODO) dvdsv</div>
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

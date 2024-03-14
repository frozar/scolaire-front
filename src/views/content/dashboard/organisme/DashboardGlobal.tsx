import { onCleanup, onMount } from "solid-js";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import { getTrips } from "../../../../_stores/trip.store";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import { DashboardMetrics } from "../molecule/DashboardMetrics";

export function DashboardGlobal() {
  onMount(() => {
    setDisplayStops(getStops());
    setDisplaySchools(getSchools());
    setDisplayTrips(getTrips());
  });

  onCleanup(() => {
    setDisplayStops([]);
    setDisplaySchools([]);
    setDisplayTrips([]);
  });

  return (
    <div>
      <DashboardMetrics trips={getTrips()} stops={getStops()} />
    </div>
  );
}

import { createSignal, onMount } from "solid-js";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import { getTrips } from "../../../../_stores/trip.store";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import { DashboardMetrics } from "./DashboardMetrics";

export function DashboardGlobal() {
  const [totalDistance, setTotalDistance] = createSignal(0);
  const [totalKmPassager, setTotalKmPassager] = createSignal(0);
  const [totalStudents, setTotalStudents] = createSignal(0);

  onMount(() => {
    setDisplayStops(getStops());
    setDisplaySchools(getSchools());
    setDisplayTrips(getTrips());
    calcTotalDistance();
    calcTotalKmPassager();
    calcTotalStudent();
  });

  function calcTotalKmPassager() {
    setTotalKmPassager(0);
    getTrips().forEach((trip) => {
      setTotalKmPassager(totalKmPassager() + Number(trip.metrics?.kmPassager));
    });
    setTotalKmPassager(roundDecimal(totalKmPassager(), 2));
  }

  function calcTotalDistance() {
    setTotalDistance(0);
    getTrips().forEach((trip) => {
      setTotalDistance(totalDistance() + Number(trip.metrics?.distance));
    });
    setTotalDistance(roundDecimal(totalDistance() / 1000, 2));
  }

  function calcTotalStudent() {
    const stopsId: number[] = [];
    setTotalStudents(0);
    getTrips().forEach((trip) => {
      trip.tripPoints.forEach((point) => {
        if (!stopsId.includes(point.id)) stopsId.push(point.id);
      });
    });

    const allStops = getStops().filter((stop) => stopsId.includes(stop.id));
    allStops.forEach((stop) => {
      stop.associated.forEach((item) => {
        setTotalStudents(totalStudents() + item.quantity);
      });
    });
    setDisplayStops(allStops);
  }

  return (
    <div>
      <DashboardMetrics
        distance={totalDistance()}
        kmPassager={totalKmPassager()}
        students={totalStudents()}
      />
    </div>
  );
}

function roundDecimal(value: number, precision: number) {
  const tmp = Math.pow(10, precision);
  return Math.round(value * tmp) / tmp;
}

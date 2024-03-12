import { createSignal, onCleanup } from "solid-js";
import { SchoolType } from "../../../../_entities/school.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { getStops } from "../../../../_stores/stop.store";
import { getTrips } from "../../../../_stores/trip.store";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import { getAllotment } from "../../allotment/organism/Allotment";
import { DashboardMetrics } from "./DashboardMetrics";

export function DashboardAllotment() {
  const [currentAllotment, setCurrentAllotment] = createSignal(0);
  const [currentTrips, setCurrentTrips] = createSignal<TripType[]>([]);
  const [totalDistance, setTotalDistance] = createSignal(0);
  const [totalKmPassager, setTotalKmPassager] = createSignal(0);
  const [totalStudents, setTotalStudents] = createSignal(0);

  function calcTotalKmPassager() {
    setTotalKmPassager(0);
    currentTrips().forEach((trip) => {
      setTotalKmPassager(totalKmPassager() + Number(trip.metrics?.kmPassager));
    });
    setTotalKmPassager(roundDecimal(totalKmPassager(), 2));
  }

  function calcTotalDistance() {
    setTotalDistance(0);
    currentTrips().forEach((trip) => {
      setTotalDistance(totalDistance() + Number(trip.metrics?.distance));
    });
    setTotalDistance(roundDecimal(totalDistance() / 1000, 2));
  }

  function onSelectChange(value: string | number) {
    const schoolList: SchoolType[] = [];
    setCurrentAllotment(Number(value));
    setCurrentTrips(
      getTrips().filter((item) => item.allotmentId == currentAllotment())
    );
    currentTrips().forEach((trip) => {
      trip.schools.forEach((school) => {
        if (!schoolList.includes(school)) {
          schoolList.push(school);
        }
      });
    });
    const stopsId: number[] = [];
    setDisplaySchools(schoolList);
    setDisplayTrips(currentTrips());
    currentTrips().forEach((trip) => {
      trip.tripPoints.forEach((point) => {
        if (!stopsId.includes(point.id)) stopsId.push(point.id);
      });
    });
    setDisplayStops(getStops().filter((stop) => stopsId.includes(stop.id)));
    calcTotalDistance();
    calcTotalKmPassager();

    const allStops = getStops().filter((stop) => stopsId.includes(stop.id));
    setTotalStudents(0);
    allStops.forEach((stop) => {
      stop.associated.forEach((item) => {
        setTotalStudents(totalStudents() + item.quantity);
      });
    });
  }

  onCleanup(() => {
    setDisplayStops([]);
    setDisplaySchools([]);
    setDisplayTrips([]);
    setTotalDistance(0);
    setTotalKmPassager(0);
    setTotalStudents(0);
  });

  return (
    <div>
      <LabeledInputSelect
        defaultValue={currentAllotment()}
        label="Allotissement"
        onChange={onSelectChange}
        options={getAllotment().map((item) => {
          return { value: Number(item.id), text: item.name };
        })}
      />
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

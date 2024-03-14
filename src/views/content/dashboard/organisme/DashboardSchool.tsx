import { createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../_entities/school.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import { getTrips } from "../../../../_stores/trip.store";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import { DashboardMetrics } from "../molecule/DashboardMetrics";

export function DashboardSchool() {
  const [selectedSchool, setSelectedSchool] = createSignal(0);
  const [currentSchool, setCurrentSchool] = createSignal<SchoolType>(
    {} as SchoolType
  );
  const [schoolTrips, setSchoolTrips] = createSignal<TripType[]>([]);
  const [totalDistance, setTotalDistance] = createSignal(0);
  const [totalKmPassager, setTotalKmPassager] = createSignal(0);
  const [totalStudents, setTotalStudents] = createSignal(0);

  onMount(() => {
    setDisplayStops([]);
    setDisplaySchools([]);
    setDisplayTrips([]);
  });

  onCleanup(() => {
    setDisplayStops([]);
    setDisplaySchools([]);
    setDisplayTrips([]);
  });

  function calcTotalKmPassager() {
    setTotalKmPassager(0);
    schoolTrips().forEach((trip) => {
      setTotalKmPassager(totalKmPassager() + Number(trip.metrics?.kmPassager));
    });
    setTotalKmPassager(roundDecimal(totalKmPassager(), 2));
  }

  function calcTotalDistance() {
    setTotalDistance(0);
    schoolTrips().forEach((trip) => {
      setTotalDistance(totalDistance() + Number(trip.metrics?.distance));
    });
    setTotalDistance(roundDecimal(totalDistance() / 1000, 2));
  }

  function onSelectChange(value: string | number) {
    setSelectedSchool(Number(value));
    getSchools().forEach((school) => {
      if (school.id == selectedSchool()) setCurrentSchool(school);
    });
    setSchoolTrips(
      getTrips().filter((item) => item.schools.includes(currentSchool()))
    );
    const stopsId: number[] = [];
    schoolTrips().forEach((trip) => {
      trip.tripPoints.forEach((point) => {
        if (!stopsId.includes(point.id)) stopsId.push(point.id);
      });
    });

    calcTotalDistance();
    calcTotalKmPassager();
    setDisplaySchools([currentSchool()]);
    setDisplayTrips(schoolTrips());
    setDisplayStops(getStops().filter((stop) => stopsId.includes(stop.id)));
    const allStops = getStops().filter((stop) => stopsId.includes(stop.id));
    setTotalStudents(0);
    allStops.forEach((stop) => {
      stop.associated.forEach((item) => {
        setTotalStudents(totalStudents() + item.quantity);
      });
    });
  }

  return (
    <div>
      <LabeledInputSelect
        defaultValue={selectedSchool()}
        label="Etablissement"
        onChange={onSelectChange}
        options={getSchools().map((school) => {
          return { value: Number(school.id), text: school.name };
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

import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { SchoolStore, getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import { getTrips } from "../../../../_stores/trip.store";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import { NatureEnum } from "../../../../type";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import { DashboardMetrics } from "../molecule/DashboardMetrics";

export function DashboardSchool() {
  const [selectedSchool, setSelectedSchool] = createSignal(0);

  const [currentTrips, setCurrentTrips] = createSignal<TripType[]>([]);
  const [currentStops, setCurrentStops] = createSignal<StopType[]>([]);
  const [currentSchools, setCurrentSchools] = createSignal<SchoolType[]>([]);

  onMount(() => {
    setDisplayStops(currentStops());
    setDisplaySchools(currentSchools());
    setDisplayTrips(currentTrips());
  });

  createEffect(() => {
    setDisplayStops(currentStops());
    setDisplaySchools(currentSchools());
    setDisplayTrips(currentTrips());
  });

  onCleanup(() => {
    setDisplayStops([]);
    setDisplaySchools([]);
    setDisplayTrips([]);
  });

  function onSelectChange(value: string | number) {
    const schoolId = Number(value);
    setSelectedSchool(schoolId);
    const school = SchoolStore.get(schoolId);
    setCurrentSchools([school]);

    const trips = getTrips().filter((item) => item.schools.includes(school));

    setCurrentTrips(trips);

    const stopsId: number[] = [];
    trips.forEach((trip) => {
      trip.tripPoints.forEach((point) => {
        if (!stopsId.includes(point.id) && point.nature == NatureEnum.stop)
          stopsId.push(point.id);
      });
    });

    const stops: StopType[] = getStops().filter((stop) =>
      stopsId.includes(stop.id)
    );
    setCurrentStops(stops);
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
      <DashboardMetrics trips={currentTrips()} stops={currentStops()} />
    </div>
  );
}

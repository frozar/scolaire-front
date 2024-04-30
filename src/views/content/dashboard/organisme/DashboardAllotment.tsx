import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { AllotmentStore } from "../../../../_stores/allotment.store";
import { getStops } from "../../../../_stores/stop.store";
import { getTrips } from "../../../../_stores/trip.store";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import { DashboardMetrics } from "../molecule/DashboardMetrics";

export function DashboardAllotment() {
  const [currentAllotment, setCurrentAllotment] = createSignal(0);

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
    setCurrentAllotment(Number(value));
    setCurrentTrips(
      getTrips().filter((item) => item.allotmentId == currentAllotment())
    );

    const schoolList: SchoolType[] = [];
    currentTrips().forEach((trip) => {
      trip.schools.forEach((school) => {
        if (!schoolList.includes(school)) {
          schoolList.push(school);
        }
      });
    });
    setCurrentSchools(schoolList);

    const stopsId: number[] = [];
    currentTrips().forEach((trip) => {
      trip.tripPoints.forEach((point) => {
        if (!stopsId.includes(point.id)) stopsId.push(point.id);
      });
    });
    const allStops = getStops().filter((stop) => stopsId.includes(stop.id));
    setCurrentStops(allStops);
  }

  return (
    <div>
      <LabeledInputSelect
        defaultValue={currentAllotment()}
        label="Lot"
        onChange={onSelectChange}
        options={AllotmentStore.get().map((item) => {
          return { value: Number(item.id), text: item.name };
        })}
      />
      <DashboardMetrics trips={currentTrips()} stops={currentStops()} />
    </div>
  );
}

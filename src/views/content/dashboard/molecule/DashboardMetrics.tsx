import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { StopType } from "../../../../_entities/stop.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { NatureEnum } from "../../../../type";

interface DashboardMetricsProps {
  trips: TripType[];
  stops: StopType[];
}

export function DashboardMetrics(props: DashboardMetricsProps) {
  const [totalDistance, setTotalDistance] = createSignal(0);
  const [totalKmPassager, setTotalKmPassager] = createSignal(0);
  const [totalStudents, setTotalStudents] = createSignal(0);

  onMount(() => {
    calculMetrics(props.trips, props.stops);
  });

  createEffect(() => {
    calculMetrics(props.trips, props.stops);
  });

  function calculMetrics(trips: TripType[], stops: StopType[]) {
    const totStud = calculTotalStudent(trips, stops);
    const totDist = calculTotalDistance(trips);
    const totKmPass = calculeTotalKmPassager(totStud, trips);
    setTotalDistance(totDist);
    setTotalKmPassager(totKmPass);
    setTotalStudents(totStud);
  }

  onCleanup(() => {
    setTotalKmPassager(0);
    setTotalDistance(0);
    setTotalStudents(0);
  });

  return (
    <div>
      <div>Distance totale : {totalDistance()} km</div>
      <div>Nombre d'élèves : {totalStudents()}</div>
      <div>Coût : -</div>
      <div>Km passager moyen : {totalKmPassager()} </div>
      <div>Economie CO² : -</div>
    </div>
  );
}

function roundDecimal(value: number, precision: number) {
  const tmp = Math.pow(10, precision);
  return Math.round(value * tmp) / tmp;
}

function calculTotalDistance(trips: TripType[]): number {
  let output = 0;
  trips.forEach((trip) => {
    output += Number(trip.metrics?.distance);
  });
  return roundDecimal(output / 1000, 2);
}

function calculTotalStudent(trips: TripType[], stops: StopType[]): number {
  let output = 0;
  const stopsId: number[] = [];
  trips.forEach((trip) => {
    trip.tripPoints.forEach((point) => {
      if (!stopsId.includes(point.id) && point.nature == NatureEnum.stop) {
        stopsId.push(point.id);
      }
    });
  });

  stops.forEach((stop) => {
    if (stopsId.includes(stop.id)) {
      stop.associated.forEach((associatedSchool) => {
        output += associatedSchool.quantity;
      });
    }
  });
  return output;
}

function calculeTotalKmPassager(students: number, trips: TripType[]) {
  let output = 0;
  if (students > 0) {
    trips.forEach((trip) => {
      output += Number(trip.metrics?.kmPassager);
    });
    output = roundDecimal(output / students, 2);
  }
  return output;
}

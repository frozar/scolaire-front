import { createSignal } from "solid-js";
import { SchoolType } from "../../../../_entities/school.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { getTrips } from "../../../../_stores/trip.store";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import { getAllotment } from "../../allotment/organism/Allotment";

export function DashboardAllotment() {
  const [currentAllotment, setCurrentAllotment] = createSignal(0);
  const [currentTrips, setCurrentTrips] = createSignal<TripType[]>([]);

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
    // TODO find a way to display only currenttrip stops
    setDisplaySchools(schoolList);
    setDisplayTrips(currentTrips());
  }

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
      <div>Distance totale : </div>
      <div>Nombre d'élèves : </div>
      <div>Coût : -</div>
      <div>KM passager moyen : </div>
      <div>Economie CO² : -</div>
    </div>
  );
}

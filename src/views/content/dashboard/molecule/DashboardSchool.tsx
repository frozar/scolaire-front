import { createSignal, onCleanup } from "solid-js";
import { SchoolType } from "../../../../_entities/school.entity";
import { getSchools } from "../../../../_stores/school.store";
import { getTrips } from "../../../../_stores/trip.store";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";

export function DashboardSchool() {
  const [selectedSchool, setSelectedSchool] = createSignal(0);
  const [currentSchool, setCurrentSchool] = createSignal<SchoolType>(
    {} as SchoolType
  );

  function onSelectChange(value: string | number) {
    setSelectedSchool(Number(value));
    getSchools().forEach((school) => {
      if (school.id == selectedSchool()) setCurrentSchool(school);
    });
    setDisplaySchools([currentSchool()]);
    setDisplayTrips(
      getTrips().filter((item) => item.schools.includes(currentSchool()))
    );
  }

  onCleanup(() => {
    setDisplayStops([]);
    setDisplaySchools([]);
    setDisplayTrips([]);
  });

  return (
    <LabeledInputSelect
      defaultValue={selectedSchool()}
      label="Etablissement"
      onChange={onSelectChange}
      options={getSchools().map((item) => {
        return { value: Number(item.id), text: item.name };
      })}
    />
  );
}

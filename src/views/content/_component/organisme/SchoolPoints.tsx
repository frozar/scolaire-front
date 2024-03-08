import L from "leaflet";
import { For, createSignal } from "solid-js";
import { SchoolType } from "../../../../_entities/school.entity";
import { SchoolPoint } from "../../map/component/molecule/SchoolPoint";

export const [displaySchools, setDisplaySchools] = createSignal<SchoolType[]>(
  []
);
export function SchoolPoints(props: { map: L.Map }) {
  return (
    <For each={displaySchools()}>
      {(school) => {
        return <SchoolPoint school={school} map={props.map} />;
      }}
    </For>
  );
}

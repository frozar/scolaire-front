import { createSignal } from "solid-js";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import { getAllotment } from "../../allotment/organism/Allotment";

export function DashboardAllotment() {
  const [currentAllotment, setCurrentAllotment] = createSignal(0);
  // const [currentTrips, setCurrentTrips] = createSignal();

  function onSelectChange(value: string | number) {
    setCurrentAllotment(Number(value));
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

import { createSignal } from "solid-js";
import { step } from "../../../../../_services/osrm.service";
import "./StopDetails.css";
import Calendar from "./VoirieDay";

export const [getSelectedWay, setSelectedWay] = createSignal<step>();
export default function WayDetails() {
  return (
    <section>
      <div>VOIRIE</div>
      <div>Détails :</div>
      <div>Nom : {getSelectedWay()?.name}</div>
      <div>ID : {getSelectedWay()?.flaxib_way_id}</div>

      <Calendar />
    </section>
  );
}

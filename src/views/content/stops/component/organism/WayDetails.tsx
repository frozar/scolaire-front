import { createSignal } from "solid-js";
import { step } from "../../../../../_services/osrm.service";
import PageTitle from "../../../../../component/atom/PageTitle";
import "./StopDetails.css";
import VoirieDay from "./VoirieDay";

export const [getSelectedWay, setSelectedWay] = createSignal<step>();
export default function WayDetails() {
  return (
    <section>
      <PageTitle title="Voirie" />
      <div>Nom : {getSelectedWay()?.name}</div>
      <div>ID : {getSelectedWay()?.flaxib_way_id}</div>

      <VoirieDay />
    </section>
  );
}

import PageTitle from "../../../../../component/atom/PageTitle";
import { getSelectedWay } from "../../../map/component/molecule/LineWeight";
import "./StopDetails.css";
import VoirieDay from "./VoirieDay";

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

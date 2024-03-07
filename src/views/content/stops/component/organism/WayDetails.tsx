import PageTitle from "../../../../../component/atom/PageTitle";
import { getSelectedWay } from "../../../map/component/molecule/LineWeight";
//TODO pas le bon CSS ...
import "../template/StopDetails.css";
import VoirieDay from "./VoirieDay";

// TODO WayDetails... pas le bon endroit ?
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

import PageTitle from "../../../../../component/atom/PageTitle";
import { getSelectedWays } from "../../../map/component/molecule/LineWeight";
import "./StopDetails.css";
import VoirieDay from "./VoirieDay";

// TODO WayDetails... pas le bon endroit ?
export default function WayDetails() {
  return (
    <section>
      <PageTitle title="Voirie" />
      <div>
        Nom :{" "}
        {getSelectedWays().length === 0
          ? ""
          : getSelectedWays().length === 1
          ? getSelectedWays()[0]?.name
          : "Selection multiple"}
      </div>
      <div>
        ID :{" "}
        {getSelectedWays().length === 1
          ? getSelectedWays()[0]?.flaxib_way_id
          : ""}
      </div>

      <VoirieDay />
    </section>
  );
}

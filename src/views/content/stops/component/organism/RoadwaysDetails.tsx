import { Setter, createSignal } from "solid-js";
import { weight } from "../../../../../_services/osrm.service";
import PageTitle from "../../../../../component/atom/PageTitle";
import { getSelectedWays } from "../../../map/component/molecule/LineWeight";
import RoadwaysDay from "./RoadwaysDay";
import { defaultWeightValue } from "./RoadwaysItems";
import "./StopDetails.css";
export const [
  displayedUpdateRoadwaysConfirmation,
  setdisplayedUpdateRoadwaysConfirmation,
] = createSignal<{
  display: boolean;
  weight: weight;
  setprevWeight: Setter<number | undefined> | undefined;
}>({ display: false, weight: defaultWeightValue(), setprevWeight: undefined });

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

      <RoadwaysDay />
    </section>
  );
}

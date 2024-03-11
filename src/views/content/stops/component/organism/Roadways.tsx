import { Setter, createSignal } from "solid-js";
import { weight } from "../../../../../_services/osrm.service";
import PageTitle from "../../../../../component/atom/PageTitle";
import { getSelectedWays } from "../../../map/component/molecule/LineWeight";
import RoadwaysDay from "./RoadwaysDay";
export const [
  displayedUpdateRoadwaysConfirmation,
  setdisplayedUpdateRoadwaysConfirmation,
] = createSignal<{
  display: boolean;
  weight: weight;
  setprevWeight: Setter<number | undefined> | undefined;
}>({ display: false, weight: defaultWeightValue(), setprevWeight: undefined });

export const [newWeigth, setnewWeigth] = createSignal<weight>(
  defaultWeightValue()
);
export const [multipleWeight, setmultipleWeight] = createSignal<weight[]>([]);

export const [isInMove, setisInMove] = createSignal<boolean>(false);

export function defaultWeightValue(): weight {
  return {
    weight: 100,
    start: -1,
    end: -1,
  };
}
export const resetNewWeight = () => setnewWeigth(defaultWeightValue());

export default function Roadways() {
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

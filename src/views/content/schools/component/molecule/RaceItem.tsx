import { RaceType } from "../../../../../_entities/race.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import Pellet from "../../../../../component/atom/Pellet";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import ArretsLogo from "../../../../../icons/ArretsLogo";
import { onClickBusRace } from "../../../map/component/molecule/Race";
import { getSelectedLine } from "../../../map/component/organism/BusLines";
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import "./RaceItem.css";

export function RaceItem(props: { race: RaceType }) {
  const schoolNames = () => {
    console.log("race", getSelectedLine());
    return props.race.schools.map((school) => school.name ?? "");
  };

  return (
    <CardWrapper class="race-item" onClick={() => onClickBusRace(props.race)}>
      <Pellet color={props.race.color} />
      <div class="race-content">
        <CardTitle title={props.race.name ?? "Pas de nom de course"} />
        <ClasseLinkedSchool schools={schoolNames()} />

        <div class="race-stops-count">
          <div class="stop-logo">
            <ArretsLogo />
          </div>
          <p>{props.race.points.length + " arrêts déservis"}</p>
        </div>
      </div>
    </CardWrapper>
  );
}

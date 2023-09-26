import { BusLineType } from "../../../../../_entities/bus-line.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import Pellet from "../../../../../component/atom/Pellet";
import ArretsLogo from "../../../../../icons/ArretsLogo";
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import "./LineItem.css";

export default function (props: { line: BusLineType }) {
  const schoolNames = () => props.line.schools.map((school) => school.name);

  return (
    <div class="line-item">
      <Pellet color={props.line.color()} />
      <div class="line-content">
        <CardTitle title={props.line.name ?? "Pas de nom de ligne"} />
        <ClasseLinkedSchool schools={schoolNames()} />

        <div class="line-stops-count">
          <div class="stop-logo">
            <ArretsLogo />
          </div>
          <p>{props.line.points.length + " arrêts déservis"}</p>
        </div>
      </div>
    </div>
  );
}

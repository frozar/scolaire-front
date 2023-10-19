import { LineType } from "../../../../../_entities/line.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import Pellet from "../../../../../component/atom/Pellet";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import ArretsLogo from "../../../../../icons/ArretsLogo";
import EtablissementLogo from "../../../../../icons/EtablissementLogo";
import VoirieLogo from "../../../../../icons/VoirieLogo";
import { setOnBoard } from "../../../board/component/template/ContextManager";
import {
  deselectAllLines,
  getLines,
} from "../../../map/component/organism/BusLines";
import "./BusLineItem.css";

export function displayBusLine(line: LineType): void {
  setOnBoard("course");
  deselectAllLines();
  getLines()
    .filter((filterline) => filterline.id === line.id)[0]
    .setSelected(true);
  // TODO to fix trip
  // setTrips(line.courses.length > 0 ? line.courses : []);
}

export default function (props: { line: LineType }) {
  return (
    <CardWrapper class="line-item" onClick={() => displayBusLine(props.line)}>
      <Pellet color={props.line.color()} />
      <div class="line-content">
        <CardTitle title={props.line.name ?? "Pas de nom de course"} />
        <div class="flex gap-2">
          <div class="line-stops-count">
            <div class="stop-logo">
              <ArretsLogo />
            </div>
            <p>{props.line.stops.length}</p>
          </div>

          <div class="line-stops-count">
            <div class="stop-logo">
              <EtablissementLogo />
            </div>
            <p>{props.line.schools.length}</p>
          </div>

          <div class="line-stops-count">
            <div class="stop-logo">
              <VoirieLogo />
            </div>
            <p>{props.line.courses.length}</p>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

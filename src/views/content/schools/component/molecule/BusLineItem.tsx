import { LineType } from "../../../../../_entities/line.entity";
import { getLines } from "../../../../../_stores/line.store";
import CardTitle from "../../../../../component/atom/CardTitle";
import Pellet from "../../../../../component/atom/Pellet";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import ArretsLogo from "../../../../../icons/ArretsLogo";
import EtablissementLogo from "../../../../../icons/EtablissementLogo";
import RoadwaysLogo from "../../../../../icons/RoadwaysLogo";
import { setOnBoard } from "../../../board/component/template/ContextManager";
import { deselectAllLines } from "../../../map/component/organism/BusLines";
import "./BusLineItem.css";

export function displayBusLine(line: LineType): void {
  setOnBoard("trip");
  deselectAllLines();
  getLines()
    .filter((filterline) => filterline.id === line.id)[0]
    .setSelected(true);
  // TODO to fix trip
  // setTrips(line.trips.length > 0 ? line.trips : []);
}

export default function (props: { line: LineType }) {
  return (
    <CardWrapper class="line-item" onClick={() => displayBusLine(props.line)}>
      <Pellet color={props.line.color()} />
      <div class="line-content">
        <CardTitle title={props.line.name ?? "Pas de nom de trip"} />
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
              <RoadwaysLogo />
            </div>
            <p>{props.line.trips.length}</p>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

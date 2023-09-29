import { BusLineType } from "../../../../../_entities/bus-line.entity";
import UpdateLineButton from "../atom/UpdateLineButton";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import Metrics from "./Metrics";
import Timeline from "./Timeline";

import { getSelectedBusLine } from "../../../map/component/organism/BusLines";
import RemoveLineButton from "../atom/RemoveLineButton";
import "./BusLineInformationBoardContent.css";
import CollapsibleElement from "./CollapsibleElement";
export function BusLineInformationBoardContent() {
  return (
    <div class="bus-line-information-board-content">
      {/* TODO Put th e2 next component in "organism" */}
      <div class="bus-line-information-board-content-title">
        <div class="bus-line-information-board-content-name">
          {getSelectedBusLine()?.name}
        </div>
        <UpdateLineButton busLine={getSelectedBusLine() as BusLineType} />
        <RemoveLineButton busLine={getSelectedBusLine() as BusLineType} />
      </div>
      <div class="bus-line-information-board-content-schools">
        <SchoolsEnumeration
          schoolsName={
            getSelectedBusLine()?.schools.map((school) => school.name) ?? []
          }
        />
      </div>

      <CollapsibleElement title="Métriques">
        <Metrics line={getSelectedBusLine()} />
      </CollapsibleElement>

      <CollapsibleElement title="TimeLine" class="timeline-collapsise">
        <Timeline />
      </CollapsibleElement>
    </div>
  );
}

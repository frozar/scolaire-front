import { BusLineType } from "../../../../../_entities/bus-line.entity";
import UpdateLineButton from "../atom/UpdateLineButton";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import Metrics from "./Metrics";
import Timeline from "./Timeline";

import { getSelectedBusLine } from "../../../map/component/organism/BusLines";

export function BusLineInformationBoardContent() {
  return (
    <div class="bus-line-information-board-content">
      {/* TODO Put th e2 next component in "organism" */}
      <div class="bus-line-information-board-content-schools">
        <SchoolsEnumeration
          schoolsName={
            getSelectedBusLine()?.schools.map((school) => school.name) ?? []
          }
        />
        <UpdateLineButton busLine={getSelectedBusLine() as BusLineType} />
      </div>
      <Metrics line={getSelectedBusLine()} />
      <Timeline />
    </div>
  );
}

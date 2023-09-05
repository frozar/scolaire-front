import { BusLineType } from "../../../../../_entities/bus-line.entity";
import UpdateLineButton from "../../../board/component/atom/UpdateLineButton";
import SchoolsEnumeration from "../../../board/component/molecule/SchoolsEnumeration";
import Metrics from "../../../board/component/organism/Metrics";
import Timeline from "../../../board/component/organism/Timeline";

import { getSelectedBusLine } from "./BusLines";

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
      p
      <Metrics line={getSelectedBusLine()} />
      <Timeline />
    </div>
  );
}

import { BusLineType } from "../../../../../_entities/bus-line.entity";
import Timeline from "../../informationBoard/Timeline";
import SchoolsEnumeration from "../../informationBoard/components/molecul/SchoolsEnumeration";
import Metrics from "../../informationBoard/components/organisme/Metrics";
import UpdateLineButton from "../atom/UpdateLineButton";
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

      <Metrics line={getSelectedBusLine()} />

      <Timeline />
    </div>
  );
}

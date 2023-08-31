import { ColorPicker } from "../atom/ColorPicker";

import { BusLineType } from "../../../../../_entities/bus-line.entity";
import { BusLineService } from "../../../../../_services/bus-line.service";
import Timeline from "../../informationBoard/Timeline";
import SchoolsEnumeration from "../../informationBoard/components/molecul/SchoolsEnumeration";
import UpdateLineButton from "../atom/UpdateLineButton";
import { getSelectedBusLine } from "./BusLines";

export function BusLineInformationBoardContent() {
  return (
    <div class="bus-line-information-board-content">
      {/* TODO Put th e2 next component in "organism" */}
      <ColorPicker
        title="Couleur de la ligne"
        onInput={onInput}
        onChange={onChange}
      />

      <UpdateLineButton busLine={getSelectedBusLine() as BusLineType} />
      <SchoolsEnumeration
        schoolsName={
          getSelectedBusLine()?.schools.map((school) => school.name) ?? []
        }
      />
      <Timeline />
    </div>
  );
}

const onInput = (color: string) => {
  const line: BusLineType | undefined = setColorOnLine(color);
  if (!line) return;
};

const onChange = async (color: string) => {
  const line: BusLineType | undefined = setColorOnLine(color);
  if (!line) return;
  // TODO Patch the Line Bus Color
  const updatedLine: BusLineType = await BusLineService.update({
    id: line.id,
    color: line.color,
    latLngs: line.latLngs,
  });

  console.log(updatedLine);
};
const setColorOnLine = (color: string): BusLineType | undefined => {
  const line: BusLineType | undefined = getSelectedBusLine();
  if (!line) return;
  line.setColor(color);
  return line;
};

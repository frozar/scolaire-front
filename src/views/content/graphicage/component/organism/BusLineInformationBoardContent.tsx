import TimelineReadMode from "../../informationBoard/TimelineReadMode";
import { ColorPicker } from "../atom/ColorPicker";

import { BusLineType } from "../../../../../_entities/bus-line.entity";
import { getSelectedBusLine } from "../../line/BusLines";

export function BusLineInformationBoardContent() {
  return (
    <div class="bus-line-information-board-content">
      {/* TODO Put th e2 next component in "organism" */}
      <ColorPicker
        title="Couleur de la ligne"
        onInput={onInput}
        onChange={onChange}
      />
      {/* TODO: Fix timeline */}
      <TimelineReadMode line={getSelectedBusLine} />
    </div>
  );
}

const onInput = (color: string) => {
  const line: BusLineType | undefined = setColorOnLine(color);
  if (!line) return;
};

const onChange = (color: string) => {
  const line: BusLineType | undefined = setColorOnLine(color);
  if (!line) return;
  // TODO Patch the Line Bus Color
};
const setColorOnLine = (color: string): BusLineType | undefined => {
  const line: BusLineType | undefined = getSelectedBusLine();
  if (!line) return;
  line.setColor(color);
  return line;
};

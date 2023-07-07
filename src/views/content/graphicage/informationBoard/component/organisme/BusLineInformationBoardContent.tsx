import { updateBusLine } from "../../../../../../request";
import { addNewUserInformation } from "../../../../../../signaux";
import {
  LineType,
  MessageLevelEnum,
  MessageTypeEnum,
} from "../../../../../../type";
import {
  linkBusLinePolyline,
  pickerColor,
  setBusLines,
} from "../../../line/BusLines";
import {
  getSelectedBusLine,
  getSelectedBusLineId,
  selectedBusLineStopNames,
} from "../../../line/busLinesUtils";
import Timeline from "../../Timeline";

export interface BusLineInformationBoardContentProps {
  props?: string;
}

export default function (props: BusLineInformationBoardContentProps) {
  props;

  // TODO analyse this function
  const handleColorPicker = (e: InputEvent) => {
    if (!e.target) {
      return;
    }

    const newColor = (e.target as HTMLInputElement).value;

    const selectedBusLineId = getSelectedBusLineId();

    if (!selectedBusLineId) {
      return;
    }

    linkBusLinePolyline[selectedBusLineId].polyline.setStyle({
      color: newColor,
    });

    const arrows = linkBusLinePolyline[selectedBusLineId].arrows;

    for (const arrow of arrows) {
      const arrowHTML = arrow.getElement();
      if (!arrowHTML) {
        return;
      }

      const iconHTMLorNull = arrowHTML.firstElementChild;
      if (!iconHTMLorNull) {
        return;
      }

      const iconHTML = iconHTMLorNull as SVGElement;
      iconHTML.setAttribute("fill", newColor);
    }
  };

  // TODO analyse this function
  const handleColorChanged = (e: Event) => {
    if (!e.target) {
      return;
    }

    const selectedBusLine = getSelectedBusLine();
    if (!selectedBusLine) {
      return;
    }

    const selectedBusLineId = selectedBusLine.idBusLine;
    const color = (e.target as HTMLInputElement).value;

    updateBusLine(selectedBusLineId, color)
      .then(() => {
        setBusLines((prevBusLines) => {
          const busLinesWithoutSelectedBusLine = prevBusLines.filter(
            (busLine) => busLine.idBusLine != selectedBusLineId
          );

          const busLineWithNewColor: LineType = {
            ...selectedBusLine,
            color,
          };

          return [...busLinesWithoutSelectedBusLine, busLineWithNewColor];
        });
      })
      .catch((err) => {
        console.log(err);
        addNewUserInformation({
          displayed: true,
          level: MessageLevelEnum.error,
          type: MessageTypeEnum.global,
          content:
            "Une erreur est survenue lors de la modification de couleur de la ligne",
        });
      });
  };

  return (
    // TODO Add CSS Style
    <div class="w-[80%]">
      {/* TODO Create atome color picker independant of the bus line and molecule dependant of bus line */}
      <div class="flex items-center gap-3">
        Couleur de la ligne
        <input
          id="nativeColorPicker1"
          type="color"
          class="border-[0.5px] p-0 border-slate-400"
          value={pickerColor()}
          onInput={handleColorPicker}
          onChange={handleColorChanged}
        />
      </div>
      <Timeline stopNames={selectedBusLineStopNames()} />
    </div>
  );
}

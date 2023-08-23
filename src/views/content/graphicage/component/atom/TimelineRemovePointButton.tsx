import { FaRegularTrashCan } from "solid-icons/fa";
import { LineUnderConstructionType } from "../../../../../type";
import { COLOR_GRAY_BASE } from "../../constant";
import { linkMap } from "../organism/Points";
import "./TimelineRemovePointButton.css";

// TODO Create stories and cypress
export function TimelineRemovePointButton(props: {
  indice: number;
  getter: () => LineUnderConstructionType;
  setter: (line: LineUnderConstructionType) => void;
}) {
  const deletePoint = (id: number) => {
    const circle = linkMap.get(props.getter().busLine.points[id].leafletId);
    circle?.setStyle({ fillColor: COLOR_GRAY_BASE });

    const stops = [...props.getter().busLine.points];
    stops.splice(id, 1);
    props.setter({
      ...props.getter(),
      busLine: { ...props.getter().busLine, points: stops },
    });
  };

  return (
    <button
      class="button-delete button-delete-timeline"
      onClick={() => deletePoint(props.indice)}
    >
      <FaRegularTrashCan />
    </button>
  );
}

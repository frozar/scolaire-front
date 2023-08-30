import { FaRegularTrashCan } from "solid-icons/fa";
import { LineUnderConstructionType } from "../../../../../type";
import { COLOR_STOP_LIGHT } from "../../constant";
import { linkMap } from "../organism/Points";
import "./TimelineRemovePointButton.css";

// TODO Create stories and cypress
export function TimelineRemovePointButton(props: {
  indice: number;
  getter: () => LineUnderConstructionType;
  setter: (line: LineUnderConstructionType) => void;
}) {
  const deletePoint = (id: number) => {
    console.log("delete depuis la timeline");

    const circle = linkMap.get(props.getter().busLine.points[id].leafletId);
    circle?.setStyle({ fillColor: COLOR_STOP_LIGHT });

    const stops = [...props.getter().busLine.points];
    stops.splice(id, 1);
    props.setter({
      ...props.getter(),
      busLine: { ...props.getter().busLine, points: stops },
    });
    // ! Faire en sorte d'activer le createEffect qui met a jour
    // ! la timeline
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

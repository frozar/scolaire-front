import { FaRegularTrashCan } from "solid-icons/fa";
import { LineUnderConstructionType } from "../../../../type";
import "./TimelineRemovePointButton.css";

// TODO Create stories and cypress
export function TimelineRemovePointButton(props: {
  indice: number;
  getter: () => LineUnderConstructionType;
  setter: (line: LineUnderConstructionType) => void;
}) {
  const deletePoint = (id: number) => {
    const stops = [...props.getter().stops];
    stops.splice(id, 1);
    props.setter({
      ...props.getter(),
      stops: stops,
    });
  };

  return (
    <button class="button-delete" onClick={() => deletePoint(props.indice)}>
      <FaRegularTrashCan />
    </button>
  );
}

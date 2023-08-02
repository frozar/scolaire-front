import { FaSolidPlus } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";
import { TimelineItemType } from "../../informationBoard/Timeline";
import "./TimelineAddPointButton.css";

const [, { setLineUnderConstruction, getLineUnderConstruction }] =
  useStateAction();
// TODO Create stories and cypress
export function TimelineAddPointButton(props: TimelineItemType) {
  const deletePoint = (id: number) => {
    const a = [...getLineUnderConstruction().stops];
    a.splice(id, 1);
    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      nextIndex: props.indice + 1,
    });
  };

  return (
    <button
      class="timeline-add-point-button"
      onClick={() => deletePoint(props.indice)}
    >
      <FaSolidPlus />
    </button>
  );
}

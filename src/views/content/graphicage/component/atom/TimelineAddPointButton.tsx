import { FaSolidPlus } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";
import { TimelineItemType } from "../../informationBoard/Timeline";
import "./TimelineAddPointButton.css";

const [, { setLineUnderConstruction, getLineUnderConstruction }] =
  useStateAction();
// TODO Create stories and cypress
export function TimelineAddPointButton(props: TimelineItemType) {
  const modifyNextIndex = (indice: number | undefined) => {
    if (indice) {
      const a = [...getLineUnderConstruction().stops];
      a.splice(indice, 1);
      setLineUnderConstruction({
        ...getLineUnderConstruction(),
        nextIndex: indice + 1,
      });
    }
  };

  return (
    <button
      class="timeline-add-point-button"
      onClick={() => modifyNextIndex(props.indice)}
    >
      <FaSolidPlus />
    </button>
  );
}

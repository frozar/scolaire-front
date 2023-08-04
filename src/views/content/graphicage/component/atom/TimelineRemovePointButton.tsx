import { FaRegularTrashCan } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";
import { TimelineItemType } from "../../informationBoard/TimelineItemReadMode";
import "./TimelineRemovePointButton.css";

const [, { setLineUnderConstruction, getLineUnderConstruction }] =
  useStateAction();
// TODO Create stories and cypress
export function TimelineRemovePointButton(props: TimelineItemType) {
  const deletePoint = (id: number) => {
    const stops = [...getLineUnderConstruction().stops];
    stops.splice(id, 1);
    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      stops: stops,
    });
  };

  return (
    <button class="button-delete" onClick={() => deletePoint(props.indice)}>
      <FaRegularTrashCan />
    </button>
  );
}

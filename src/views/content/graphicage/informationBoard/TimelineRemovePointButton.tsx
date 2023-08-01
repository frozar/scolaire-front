import { FaRegularTrashCan } from "solid-icons/fa";
import { useStateAction } from "../../../../StateAction";
import { TimelineItemType } from "./Timeline";

const [, { setLineUnderConstruction, getLineUnderConstruction }] =
  useStateAction();
// TODO Create stories and cypress
export function TimelineRemovePointButton(props: TimelineItemType) {
  const deletePoint = (id: number) => {
    const a = [...getLineUnderConstruction().stops];
    a.splice(id, 1);
    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      stops: a,
    });
  };

  return (
    <button class="button-delete" onClick={() => deletePoint(props.indice)}>
      <FaRegularTrashCan />
    </button>
  );
}

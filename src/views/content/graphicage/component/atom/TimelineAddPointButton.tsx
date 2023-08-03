import { FaSolidPlus } from "solid-icons/fa";
import { TimelineItemType } from "../../informationBoard/Timeline";
import "./TimelineAddPointButton.css";

// TODO Create stories and cypress
export function TimelineAddPointButton(props: TimelineItemType) {
  const modifyNextIndex = (indice: number) => {
    console.log("ici ", indice);
    console.log("la");
    const a = [...props.getter()?.stops];
    a.splice(indice, 1);
    props.setter({
      ...props.getter(),
      nextIndex: indice + 1,
    });
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

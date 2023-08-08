import { FaSolidPlus } from "solid-icons/fa";
import { LineUnderConstructionType } from "../../../../../type";
import "./TimelineAddPointButton.css";

// TODO Create stories and cypress
export function TimelineAddPointButton(props: {
  indice: number;
  getter: () => LineUnderConstructionType;
  setter: (line: LineUnderConstructionType) => void;
}) {
  const modifyNextIndex = (indice: number) => {
    const a = [...props.getter()?.stops];
    a.splice(indice, 1);
    props.setter({
      ...props.getter(),
      nextIndex: indice,
    });
  };

  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body body-add">
        <div class="d-flex">
          <strong>{"Sélectionnez un point sur la carte"}</strong>
        </div>
      </div>

      <div class="v-timeline-divider ">
        <div class="v-timeline-divider__dot v-timeline-divider__dot--size-very-small timeline-add-point-button">
          <button
            class=""
            onClick={() => modifyNextIndex(props.indice)}
            title="Ajouter un point"
          >
            <FaSolidPlus />
          </button>
        </div>
      </div>
    </div>
  );
}

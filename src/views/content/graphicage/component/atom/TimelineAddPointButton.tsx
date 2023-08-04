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
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <strong>{"veuillez"}</strong>
        </div>
      </div>

      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />

        <div class="v-timeline-divider__dot v-timeline-divider__dot--size-small">
          <i class="" aria-hidden="true" />
          <button
            class="timeline-add-point-button"
            onClick={() => modifyNextIndex(props.indice)}
          >
            <FaSolidPlus />
          </button>
        </div>

        <div class="v-timeline-divider__after" />
      </div>
    </div>
  );
}

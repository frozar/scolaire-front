import { FaSolidPlus } from "solid-icons/fa";
// import { setCurrentTripIndex } from "../organism/DrawTripBoard";
import "./TripTimelineAddPointButton.css";

// TODO Create stories and cypress
export function TripTimelineAddPointButton(props: { indice: number }) {
  return (
    <div class="v-timeline-item-add">
      <div class="v-timeline-divider ">
        <div class="v-timeline-divider__dot v-timeline-divider__dot--size-very-small timeline-add-point-button">
          <button
            class=""
            onClick={() => console.log(props.indice)}
            // onClick={() => setCurrentTripIndex(props.indice)}
            title="Ajouter un point"
          >
            <FaSolidPlus />
          </button>
        </div>
      </div>
      <div class="v-timeline-item__body body-add">
        <div class="d-flex">
          <strong>{"Sélectionnez un point sur la carte"}</strong>
        </div>
      </div>
    </div>
  );
}

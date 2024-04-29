import { FaSolidPlus } from "solid-icons/fa";
import "./TripTimelineAddPointButton.css";

// TODO Create stories and cypress
export function TripTimelineAddPointButton(props: { onClickAdd: () => void }) {
  return (
    <div class="timeline-add-item">
      <button
        class=""
        onClick={() => props.onClickAdd}
        title="Ajouter un point"
      >
        <FaSolidPlus />
      </button>
      {/* <p>{"Sélectionnez un point sur la carte"}</p> */}
    </div>
  );
}

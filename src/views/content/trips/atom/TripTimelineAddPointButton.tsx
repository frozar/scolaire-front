import { FaSolidPlus } from "solid-icons/fa";
import "./TripTimelineAddPointButton.css";

export function TripTimelineAddPointButton(props: {
  onClickAdd: () => void;
  enable: boolean;
}) {
  function onClick() {
    props.onClickAdd();
  }

  return (
    <div class={"timeline-add-item " + (props.enable ? "enable" : "")}>
      <button class="" onClick={onClick} title="Ajouter un point">
        <FaSolidPlus />
      </button>
      {/* <p>{"Sélectionnez un point sur la carte"}</p> */}
    </div>
  );
}

import Button from "../../../../component/atom/Button";
import "./BusStopsMenuButtons.css";

interface BusStopsMenuMapButtonsProps {
  choosingLocal: boolean;
  choosingWay: boolean;
  toggleChoosingLocal: () => void;
  toggleChoosingWay: () => void;
}

export function BusStopsMenuMapButtons(props: BusStopsMenuMapButtonsProps) {
  return (
    <div class="bus-stop-menu-map-buttons">
      <Button
        onClick={props.toggleChoosingLocal}
        isDisabled={props.choosingLocal}
        label="Modfier l'emplacement"
      />
      <Button
        onClick={props.toggleChoosingWay}
        isDisabled={props.choosingWay}
        label="Choisir un chemin"
      />
    </div>
  );
}

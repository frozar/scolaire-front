import Button from "../../../../component/atom/Button";
import "./VehicleMenuButtons.css";
import { setIsVehicleMenuOpened } from "./vehicle/VehicleTab";

interface VehicleMenuButtonsProps {
  submitFunction: () => void;
}

export function VehicleMenuButtons(props: VehicleMenuButtonsProps) {
  return (
    <div class="vehicles-menu-buttons">
      <Button
        onClick={() => setIsVehicleMenuOpened(false)}
        label="Annuler"
        variant="danger"
        isDisabled={false}
      />
      <Button
        onClick={props.submitFunction}
        label="Créer"
        variant="primary"
        isDisabled={false}
      />
    </div>
  );
}

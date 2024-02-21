import PlusIcon from "../../../../icons/PlusIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./TransporterEditVehicles.css";

export function TransporterEditVehiclesHeader() {
  function addVehicle() {
    console.log("add vehicle");
  }

  return (
    <div class="transporter-vehicles-header">
      <p>Liste des véhicules</p>
      <ButtonIcon icon={<PlusIcon />} onClick={addVehicle} />
    </div>
  );
}

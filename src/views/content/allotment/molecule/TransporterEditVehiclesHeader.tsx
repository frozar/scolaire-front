import PlusIcon from "../../../../icons/PlusIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./TransporterEditVehicles.css";

export function TransporterEditVehiclesHeader(props: { add: () => void }) {
  return (
    <div class="transporter-vehicles-header">
      <p>Liste des véhicules</p>
      <ButtonIcon icon={<PlusIcon />} onClick={props.add} />
    </div>
  );
}

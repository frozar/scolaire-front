import { SurroundedPlusIcon } from "../../../../icons/SurroundedPlusIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./TransporterEditVehicles.css";

export function TransporterEditVehiclesHeader(props: { add: () => void }) {
  return (
    <div class="transporter-vehicles-header">
      <p>Liste des véhicules</p>
      <ButtonIcon icon={<SurroundedPlusIcon />} onClick={props.add} />
    </div>
  );
}

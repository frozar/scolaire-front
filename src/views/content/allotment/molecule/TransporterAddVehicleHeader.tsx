import { SurroundedPlusIcon } from "../../../../icons/SurroundedPlusIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";

export function TransporterAddvehicleHeader(props: { add: () => void }) {
  return (
    <div class="transporter-add-vehicle">
      <p>Liste des véhicules</p>
      <ButtonIcon icon={<SurroundedPlusIcon />} onClick={props.add} />
    </div>
  );
}

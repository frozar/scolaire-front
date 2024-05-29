import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./TransporterItem.css";

interface TransporterItemProps {
  enableEditCb: () => void;
  deleteCb: () => void;
  name: string;
  type: string;
  vehicleLenght: number;
  costLenght: number;
}

export function TransporterItem(props: TransporterItemProps) {
  function hasCost() {
    if (props.costLenght > 0) return "Avec";
    return "Sans";
  }

  return (
    <div class="transporter-item-container">
      <div>
        <p>{"Nom : " + props.name}</p>
        <p>{"Type : " + props.type}</p>
        <p>{"Véhicules : " + props.vehicleLenght}</p>
        <p>{"Coût spécifique : " + hasCost()}</p>
      </div>
      <div class="transporter-item-buttons">
        <ButtonIcon icon={<UpdatePen />} onClick={props.enableEditCb} />
        <ButtonIcon icon={<TrashIcon />} onClick={props.deleteCb} />
      </div>
    </div>
  );
}

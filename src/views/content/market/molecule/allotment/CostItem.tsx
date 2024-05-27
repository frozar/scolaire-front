import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./CostItem.css";

interface CostItemProps {
  enableEditCb: () => void;
  deleteCb: () => void;
  vehicleName: string;
  busCategoryId: number;
  cost: number;
  costHlp: number;
}

export function CostItem(props: CostItemProps) {
  return (
    <div class="cost-item-container">
      <p>{"Bus : " + props.vehicleName}</p>
      <p>{"Coût : " + props.cost + "€ / km"}</p>
      <p>{"Coût HLP : " + props.costHlp + "€ / km"}</p>
      <div class="cost-item-buttons">
        <ButtonIcon icon={<UpdatePen />} onClick={props.enableEditCb} />
        <ButtonIcon icon={<TrashIcon />} onClick={props.deleteCb} />
      </div>
    </div>
  );
}

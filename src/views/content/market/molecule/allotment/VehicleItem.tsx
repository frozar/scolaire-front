import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./VehicleItem.css";

interface VehicleItemProps {
  enableEditCb: () => void;
  deleteCb: () => void;
  licensePlate: string;
  busCategoryId: number;
  vehicleName: string;
}

export default function VehicleItem(props: VehicleItemProps) {
  return (
    <div class="vehicle-item-container">
      <p>{"Immatriculation : " + props.licensePlate}</p>
      <p>{"Bus : " + props.vehicleName}</p>
      <div class="vehicle-item-buttons">
        <ButtonIcon icon={<UpdatePen />} onClick={() => props.enableEditCb()} />
        <ButtonIcon icon={<TrashIcon />} onClick={() => props.deleteCb()} />
      </div>
    </div>
  );
}

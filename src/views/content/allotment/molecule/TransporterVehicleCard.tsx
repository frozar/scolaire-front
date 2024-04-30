import { TransporterVehicleType } from "../../../../_entities/transporter.entity";
import CardWrapper from "../../../../component/molecule/CardWrapper";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";

interface TransporterVehicleCardProps {
  item: TransporterVehicleType;
}

export function TransporterVehicleCard(props: TransporterVehicleCardProps) {
  return (
    <CardWrapper class="flex justify-between">
      <div class="flex gap-4">
        <p>{props.item.license}</p>
        <p>{props.item.bus_categories_id}</p>
      </div>
      <div class="flex gap-4">
        <ButtonIcon icon={<UpdatePen />} onClick={() => console.log()} />
        <ButtonIcon icon={<TrashIcon />} onClick={() => console.log()} />
      </div>
    </CardWrapper>
  );
}

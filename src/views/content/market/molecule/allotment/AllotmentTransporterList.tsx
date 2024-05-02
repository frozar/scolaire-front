import { CirclePlusIcon } from "../../../../../icons/CirclePlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";

interface AllotmentTransporterListProps {
  allotmentId: number;
}

export function AllotmentTransporterList(props: AllotmentTransporterListProps) {
  function addtransporter() {
    console.log(props.allotmentId);
  }

  return (
    <div>
      <div class="allotment-cost-header">
        <p>Ajouter un transporteur</p>
        <ButtonIcon icon={<CirclePlusIcon />} onClick={addtransporter} />
      </div>
    </div>
  );
}

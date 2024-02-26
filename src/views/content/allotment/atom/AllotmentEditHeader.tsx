import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./AllotmentEditHeader.css";

export function AllotmentEditHeader(props: {
  title: string;
  toggle: () => void;
}) {
  return (
    <div class="allotment-edit-header">
      <p>Editer : {props.title}</p>
      <ButtonIcon icon={<CircleCrossIcon />} onClick={props.toggle} />
    </div>
  );
}

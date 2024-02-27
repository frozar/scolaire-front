import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./TransporterEditMenuHeader.css";

export function TransporterEditMenuHeader(props: {
  title: string;
  toggle: () => void;
}) {
  return (
    <div class="transporter-header">
      <p>Editer : {props.title}</p>
      <ButtonIcon icon={<CircleCrossIcon />} onClick={props.toggle} />
    </div>
  );
}

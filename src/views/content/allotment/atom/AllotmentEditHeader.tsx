import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setIsAllotmentMenuOpen } from "../molecule/AllotmentTableLine";
import "./AllotmentEditHeader.css";

export function AllotmentEditHeader(props: {
  title: string;
  toggle: () => void;
}) {
  function closeMenu() {
    props.toggle();
    setIsAllotmentMenuOpen(false);
  }

  return (
    <div class="allotment-edit-header">
      <p>Editer : {props.title}</p>
      <ButtonIcon icon={<CircleCrossIcon />} onClick={closeMenu} />
    </div>
  );
}

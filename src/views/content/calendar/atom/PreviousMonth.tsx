import LeftChevronIcon from "../../../../icons/LeftChevronIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setCurrentMonth } from "../template/Calendar";

export function PreviousMonth(props: { month: Date }) {
  function previousMonth() {
    setCurrentMonth(
      new Date(props.month.getFullYear(), props.month.getMonth() - 1)
    );
    //
  }
  return (
    <ButtonIcon
      icon={<LeftChevronIcon />}
      onClick={previousMonth}
      class="month-previous-button"
    />
  );
}

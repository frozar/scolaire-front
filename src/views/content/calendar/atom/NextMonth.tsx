import LeftChevronIcon from "../../../../icons/LeftChevronIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setCurrentMonth } from "../template/Calendar";
import "./NextMonth.css";

export function NextMonth(props: { month: Date }) {
  function nextMonth() {
    setCurrentMonth(
      new Date(props.month.getFullYear(), props.month.getMonth() + 1)
    );
  }

  return (
    <ButtonIcon
      icon={<LeftChevronIcon />}
      onClick={nextMonth}
      class="month-next-button"
    />
  );
}

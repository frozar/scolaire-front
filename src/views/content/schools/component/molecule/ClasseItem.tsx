import { FaRegularTrashCan, FaSolidPen } from "solid-icons/fa";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./ClasseItem.css";

interface ClasseItemProps {
  nameClass: string;
  NbStudents?: number;
}

export default function (props: ClasseItemProps) {
  function onClickEdit() {
    console.log("Edit classe");
  }

  function onClickDelete() {
    console.log("Delete classe");
  }

  return (
    <CardWrapper class="classe-item">
      <div class="left">
        <CardTitle title={props.nameClass} />
        <p>{props.NbStudents ? props.NbStudents + " élèves" : "Todo élèves"}</p>
      </div>

      <div class="classe-item-actions">
        <ButtonIcon
          icon={<FaRegularTrashCan class="fill-red-base" />}
          onClick={onClickDelete}
        />
        <ButtonIcon
          icon={<FaSolidPen class="fill-green-base" />}
          onClick={onClickEdit}
        />
      </div>
    </CardWrapper>
  );
}

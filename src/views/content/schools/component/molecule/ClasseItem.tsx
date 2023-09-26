import { FaRegularTrashCan, FaSolidPen } from "solid-icons/fa";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import CardTitle from "../atom/CardTitle";
import "./ClasseItem.css";

interface ClasseItemProps {
  classe: string;
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
    <div class="classe-item">
      <div class="left">
        <CardTitle title={props.classe} />
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
    </div>
  );
}

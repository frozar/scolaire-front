import { FaRegularTrashCan, FaSolidPen } from "solid-icons/fa";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./ClasseItem.css";

interface ClasseItemProps {
  classe: string;
  NbStudents: number;
}

export default function (props: ClasseItemProps) {
  function onClickEdit() {
    console.log("Edit classe");
  }

  function onClickDelete() {
    console.log("Delete classe");
  }

  return (
    <div class="line-item">
      <div class="left">
        <p>{props.classe}</p>
        <p>{props.NbStudents + " élèves"}</p>
      </div>

      <div class="line-item-actions">
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
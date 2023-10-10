import { FaRegularTrashCan, FaSolidPen } from "solid-icons/fa";
import { ClasseType } from "../../../../../_entities/classe.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { setSelectedClasse } from "../organism/ClasseBoardModifyRefactored";
import "./ClasseItem.css";

// interface ClasseItemProps {
//   nameClass: string;
//   NbStudents?: number;
// }
interface ClasseItemProps {
  class: ClasseType;
  NbStudents?: number;
}

export default function (props: ClasseItemProps) {
  function onClickEdit() {
    console.log("Edit classe");
    setSelectedClasse(props.class);
    changeBoard("school-class-modify");
  }

  function onClickDelete() {
    console.log("Delete classe");
  }

  return (
    <CardWrapper class="classe-item">
      <div class="left">
        <CardTitle title={props.class.name} />
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

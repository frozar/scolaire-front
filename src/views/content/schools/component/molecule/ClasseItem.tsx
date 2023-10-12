import { FaRegularTrashCan, FaSolidPen } from "solid-icons/fa";
import { ClasseType } from "../../../../../_entities/classe.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { setRemoveClasseConfirmation } from "../../../../../signaux";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { setSelectedClasse } from "../organism/ClasseBoard";
import "./ClasseItem.css";

interface ClasseItemProps {
  classe: ClasseType;
  NbStudents?: number;
}

export default function (props: ClasseItemProps) {
  function onClickEdit() {
    setSelectedClasse(props.classe);
    changeBoard("school-class-modify");
  }

  async function onClickDelete() {
    setRemoveClasseConfirmation({
      displayed: true,
      classe: props.classe,
    });
  }

  return (
    <CardWrapper class="classe-item">
      <div class="left">
        <CardTitle title={props.classe.name} />
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

import { FaRegularTrashCan, FaSolidPen } from "solid-icons/fa";
import { ClasseType } from "../../../../../_entities/classe.entity";
import { ClasseService } from "../../../../../_services/classe.service";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import {
  getSchools,
  setSchools,
} from "../../../map/component/organism/SchoolPoints";
import { setSelectedClasse } from "../organism/ClasseBoard";
import {
  schoolDetailsItem,
  setSchoolDetailsItem,
} from "../organism/SchoolDetails";
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

  async function deleteClasse() {
    const isDeleted = await ClasseService.delete(props.classe?.id as number);

    // TODO: Display user message feedback
    if (isDeleted) {
      // eslint-disable-next-line solid/reactivity
      setSchools((prev) => {
        return [...prev].map((school) => {
          return {
            ...school,
            classes: school.classes.filter(
              (classe) => classe.id != props.classe?.id
            ),
          };
        });
      });
      const schoolDetailsItemId = schoolDetailsItem()?.id as number;
      setSchoolDetailsItem(
        getSchools().filter((school) => school.id == schoolDetailsItemId)[0]
      );
      // TODO: Refactor ?
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.success,
        type: MessageTypeEnum.global,
        content: "La classe a bien été supprimée.",
      });
    } else {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.removeCourse, // TODO: Check if it's useless
        content: "Impossible de supprimer la classe.",
      });
    }
  }

  async function onClickDelete() {
    setRemoveConfirmation({
      textToDisplay: "Êtes-vous sûr de vouloir supprimer la classe",
      itemName: props.classe.name,
      validate: deleteClasse,
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

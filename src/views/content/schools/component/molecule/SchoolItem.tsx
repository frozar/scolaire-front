import { FaRegularTrashCan } from "solid-icons/fa";
import { Accessor, createSignal } from "solid-js";
import {
  SchoolEntity,
  SchoolType,
} from "../../../../../_entities/school.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { updatePointColor } from "../../../../../leafletUtils";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { SchoolUtils } from "../../../../../utils/school.utils";
import { ViewManager } from "../../../ViewManager";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { QuantityStatusPellet } from "./QuantityStatusPellet";
import "./SchoolItem.css";

export interface SchoolItemProps {
  school: SchoolType;
}

export default function (props: SchoolItemProps) {
  const [refTrashButton, setRefTrashButton] = createSignal<HTMLButtonElement>();

  async function onClickDelete() {
    setRemoveConfirmation({
      textToDisplay: "Êtes-vous sûr de vouloir supprimer la grade : ",
      itemName: props.school.name,
      validate: () => SchoolUtils.DeleteSchool(props.school.id),
    });
  }

  async function onClickEdit() {
    ViewManager.schoolDetails(props.school);
    updatePointColor(props.school);
  }

  return (
    <CardWrapper
      onClick={onClickEdit}
      class="z-10"
      refClickableButtons={[refTrashButton] as Accessor<HTMLButtonElement>[]}
    >
      <div class="school-item-head">
        <CardTitle title={props.school.name} />
        <div class="school-item-actions">
          <ButtonIcon
            refSetter={setRefTrashButton}
            icon={<FaRegularTrashCan class="fill-red-base" />}
            onClick={onClickDelete}
            disable={true}
          />
        </div>
      </div>
      <div class="school-item-content">
        <div class="flex items-center gap-2">
          <span class="w-[14px] ">
            <QuantityStatusPellet schoolId={props.school.id} />
          </span>
          <p>élèves: {SchoolUtils.getTotalQuantity(props.school.id)}</p>
        </div>
        <p>classes: {props.school.grades.length ?? "-"}</p>
        <p>Trips: {SchoolEntity.getSchoolTrips(props.school.id).length}</p>
      </div>
    </CardWrapper>
  );
}

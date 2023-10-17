import { FaRegularTrashCan } from "solid-icons/fa";
import { Accessor, createSignal } from "solid-js";
import {
  SchoolEntity,
  SchoolType,
} from "../../../../../_entities/school.entity";
import { SchoolService } from "../../../../../_services/school.service";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { updatePointColor } from "../../../../../leafletUtils";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { getLines, setLines } from "../../../map/component/organism/BusLines";
import {
  getSchools,
  setSchools,
} from "../../../map/component/organism/SchoolPoints";
import { getStops, setStops } from "../../../map/component/organism/StopPoints";
import { setSchoolDetailsItem } from "../organism/SchoolDetails";
import "./SchoolItem.css";

export interface SchoolItemProps {
  school: SchoolType;
}

export default function (props: SchoolItemProps) {
  const [refTrashButton, setRefTrashButton] = createSignal<HTMLButtonElement>();

  async function onClickDelete() {
    setRemoveConfirmation({
      textToDisplay: "Êtes-vous sûr de vouloir supprimer la classe : ",
      itemName: "props.classe.name",
      validate: Delete,
    });
  }
  async function Delete() {
    const id_school: number = await SchoolService.delete(props.school.id);
    const deletedSchool = getSchools().filter(
      (school) => school.id == id_school
    );
    const deletedClasses = deletedSchool
      .map((school) => school.classes.flatMap((classe) => classe.id as number))
      .flat();

    const newStops = getStops().map((stop) => {
      return {
        ...stop,
        associated: stop.associated.filter((classe) =>
          deletedClasses.includes(classe.classId)
        ),
      };
    });
    setStops(newStops);

    const newLines = getLines().map((line) => {
      return {
        ...line,
        schools: line.schools.filter((school) => school.id != id_school),
        courses: line.courses.filter(
          (course) =>
            !course.schools
              .map((schoolCourse) => schoolCourse.id)
              .includes(id_school)
        ),
      };
    });

    setLines(newLines);

    setSchools(getSchools().filter((school) => school.id != id_school));
    console.log("response", id_school);
    // TODO to review
    if (!id_school) return false;
    return true;
  }

  async function onClickEdit() {
    // TODO: setup board manager for school
    setSchoolDetailsItem(props.school);
    changeBoard("school-details");
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
          />
        </div>
      </div>
      <div class="school-item-content">
        <p>Races: {SchoolEntity.getSchoolRaces(props.school.id).length}</p>
        <p>classes: {props.school.classes.length ?? "-"}</p>
        <p>élèves: {SchoolEntity.getTotalQuantity(props.school)}</p>
      </div>
    </CardWrapper>
  );
}

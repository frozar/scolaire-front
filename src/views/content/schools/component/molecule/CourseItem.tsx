import { CourseType } from "../../../../../_entities/course.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import Pellet from "../../../../../component/atom/Pellet";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import ArretsLogo from "../../../../../icons/ArretsLogo";
import { onClickBusCourse } from "../../../map/component/molecule/Course";
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import "./CourseItem.css";

export default function (props: { line: CourseType }) {
  const schoolNames = () =>
    props.line.schools.map((school) => school.name ?? "");

  return (
    <CardWrapper class="line-item" onClick={() => onClickBusCourse(props.line)}>
      <Pellet color={props.line.color()} />
      <div class="line-content">
        <CardTitle title={props.line.name ?? "Pas de nom de course"} />
        <ClasseLinkedSchool schools={schoolNames()} />

        <div class="line-stops-count">
          <div class="stop-logo">
            <ArretsLogo />
          </div>
          <p>{props.line.points.length + " arrêts déservis"}</p>
        </div>
      </div>
    </CardWrapper>
  );
}

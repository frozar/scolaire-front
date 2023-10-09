import { LineType } from "../../../../../_entities/line.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import Pellet from "../../../../../component/atom/Pellet";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import ArretsLogo from "../../../../../icons/ArretsLogo";
import { setCurrentBusLine } from "../../../board/component/organism/BusLinesBoard";
import { setOnBoard } from "../../../board/component/template/ContextManager";
import { setCourses } from "../../../map/component/organism/Courses";
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import "./CourseItem.css";

export function displayBusLine(line: LineType): void {
  setCurrentBusLine(line);
  console.log("line", line);
  setCourses(line.courses.length > 0 ? line.courses : []);
  setOnBoard("course");
}

export default function (props: { line: LineType }) {
  const schoolNames = () =>
    props.line.schools.map((school) => school.name ?? "");

  return (
    <CardWrapper class="line-item" onClick={() => displayBusLine(props.line)}>
      <Pellet color={props.line.color()} />
      <div class="line-content">
        <CardTitle title={props.line.name ?? "Pas de nom de course"} />
        <ClasseLinkedSchool schools={schoolNames()} />

        <div class="line-stops-count">
          <div class="stop-logo">
            <ArretsLogo />
          </div>
          <p>{props.line.courses.length + " courses déservies"}</p>
        </div>
      </div>
    </CardWrapper>
  );
}

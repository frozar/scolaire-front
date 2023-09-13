import Pellet from "../../../../../component/atom/Pellet";
import ArretsLogo from "../../../../../icons/ArretsLogo";
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import { LineItemProps } from "../organism/LinesList";
import "./LineItem.css";

export default function (props: { line: LineItemProps }) {
  return (
    <div class="class-item">
      <Pellet color="red" />
      <div class="class-content">
        <p>{props.line.lineName}</p>

        <ClasseLinkedSchool schools={props.line.linkedSchools} />

        <div class="flex">
          <div class="stop-logo">
            <ArretsLogo />
          </div>
          <p>{props.line.NbStopDeserved + " arrêts déservis"}</p>
        </div>
      </div>
    </div>
  );
}

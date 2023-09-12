import Pellet from "../../../../../component/atom/Pellet";
import ArretsLogo from "../../../../../icons/ArretsLogo";
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import "./ClasseItem.css";

interface ClasseProps {
  line: {
    lineName: string;
    linkedSchools: string[];
    linkedStops: number;
    NbStopDeserved: number;
    color: string;
  };
}

export default function (props: ClasseProps) {
  return (
    <div class="class-item">
      <Pellet color="red" />
      <div class="class-content">
        <p>{props.line.lineName}</p>

        <ClasseLinkedSchool schools={props.line.linkedSchools} />

        <div class="flex">
          <div class="w-[15px] mr-2">
            <ArretsLogo />
          </div>
          <p>{props.line.NbStopDeserved + " arrêts déservis"}</p>
        </div>
      </div>
    </div>
  );
}

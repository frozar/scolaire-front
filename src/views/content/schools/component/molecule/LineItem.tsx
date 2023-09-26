import { createSignal } from "solid-js";
import { BusLineType } from "../../../../../_entities/bus-line.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import Pellet from "../../../../../component/atom/Pellet";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import ArretsLogo from "../../../../../icons/ArretsLogo";
import TrashIcon from "../../../../../icons/TrashIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { onClickBusLine } from "../../../map/component/molecule/BusLine";
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import "./LineItem.css";

export default function (props: { line: BusLineType }) {
  const [refTrashButton, setRefTrashButton] = createSignal<HTMLButtonElement>();
  const schoolNames = () => props.line.schools.map((school) => school.name);

  function onClickDelete() {
    console.log("delete line");
  }

  return (
    <CardWrapper
      class="line-item"
      onClick={() => onClickBusLine(props.line)}
      refClickableButtons={[refTrashButton]}
    >
      <Pellet color={props.line.color()} />
      <div class="line-content">
        <div class="flex justify-between">
          <CardTitle title={props.line.name ?? "Pas de nom de ligne"} />

          <ButtonIcon
            icon={<TrashIcon />}
            onClick={onClickDelete}
            refSetter={setRefTrashButton}
          />
        </div>
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

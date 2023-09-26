import { useStateAction } from "../../../../../StateAction";
import { BusLineType } from "../../../../../_entities/bus-line.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import Pellet from "../../../../../component/atom/Pellet";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import ArretsLogo from "../../../../../icons/ArretsLogo";
import {
  setSchoolPointsColor,
  setStopPointsColor,
} from "../../../../../leafletUtils";
import { setRemoveConfirmation } from "../../../../../signaux";
import { setPickerColor } from "../../../board/component/atom/ColorPicker";
import {
  changeBoard,
  onBoard,
} from "../../../board/component/template/ContextManager";
import { deselectAllBusLines } from "../../../map/component/organism/BusLines";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import { COLOR_SCHOOL_LIGHT, COLOR_STOP_LIGHT } from "../../../map/constant";
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import "./LineItem.css";

const [, { isInRemoveLineMode }] = useStateAction();

export default function (props: { line: BusLineType }) {
  const schoolNames = () => props.line.schools.map((school) => school.name);

  function onClick() {
    changeBoard("line-details");
    if (isInRemoveLineMode()) {
      if (props.line.id) {
        setRemoveConfirmation({
          displayed: true,
          idBusLine: props.line.id,
        });
      }
    }

    if (onBoard() != "line-draw") {
      deselectAllBusLines();
      deselectAllPoints();
      setPickerColor(props.line.color());
      props.line.setSelected(true);

      const leafletIds = props.line.points.map((point) => point.leafletId);
      setStopPointsColor(leafletIds, COLOR_STOP_LIGHT);
      setSchoolPointsColor(leafletIds, COLOR_SCHOOL_LIGHT);
    }
  }

  return (
    <CardWrapper class="line-item" onClick={onClick}>
      <Pellet color={props.line.color()} />
      <div class="line-content">
        <CardTitle title={props.line.name ?? "Pas de nom de ligne"} />
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

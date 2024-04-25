import { FaSolidWandMagicSparkles } from "solid-icons/fa";
import { DrawHelperEntity } from "../../../../_entities/drawhelper.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { DrawHelperUtils } from "../../../../utils/drawHelper.utils";
import DrawHelperDialog, {
  openDrawHelperDialog,
} from "../../board/component/molecule/DrawHelperDialog";
import "./DrawHelperButton.css";

interface DrawHelperButtonProps {
  schools: SchoolType[] | undefined;
}

export function DrawHelperButton(props: DrawHelperButtonProps) {
  async function requestCircuit(
    capacity: number,
    timeLimitSeconds: number,
    nbLimitSolution: number
  ) {
    await DrawHelperUtils.drawHelper(
      DrawHelperEntity.format(
        capacity,
        timeLimitSeconds,
        nbLimitSolution,
        props.schools ?? []
      )
    );
  }

  async function onclick() {
    openDrawHelperDialog();
  }

  return (
    <div class="graphicage-draw-helper-button">
      <DrawHelperDialog requestCircuit={requestCircuit} />
      <button onClick={onclick}>
        <FaSolidWandMagicSparkles />
      </button>
    </div>
  );
}

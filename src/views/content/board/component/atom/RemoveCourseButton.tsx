import { BusCourseType } from "../../../../../_entities/bus-course.entity";
import TrashIcon from "../../../../../icons/TrashIcon";
import { setRemoveConfirmation } from "../../../../../signaux";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import ButtonIcon from "../molecule/ButtonIcon";

export interface RemoveCourseButtonProps {
  busCourse: BusCourseType;
}

export default function (props: RemoveCourseButtonProps) {
  const onclick = () => {
    deselectAllPoints();
    if (props.busCourse.id) {
      setRemoveConfirmation({
        displayed: true,
        busCourse: props.busCourse,
      });
    }
  };

  return (
    <ButtonIcon
      icon={<TrashIcon />}
      onClick={onclick}
      class="graphicage-draw-update-button"
    />
  );
}

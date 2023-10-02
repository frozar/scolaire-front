import { CourseType } from "../../../../../_entities/course.entity";
import TrashIcon from "../../../../../icons/TrashIcon";
import { setRemoveConfirmation } from "../../../../../signaux";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import ButtonIcon from "../molecule/ButtonIcon";

export interface RemoveLineButtonProps {
  course: CourseType;
}

export default function (props: RemoveLineButtonProps) {
  const onclick = () => {
    deselectAllPoints();
    if (props.course.id) {
      setRemoveConfirmation({
        displayed: true,
        course: props.course,
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

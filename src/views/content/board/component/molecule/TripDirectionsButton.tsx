import { TripDirectionEnum } from "../../../../../_entities/trip-direction.entity";
import { CustomButton } from "../../../../../component/atom/CustomButton";

interface TripDirectionsButtonProps {
  onDirection: TripDirectionEnum;
  onClickComing: () => void;
  onClickGoing: () => void;
}

export function TripDirectionsButton(props: TripDirectionsButtonProps) {
  return (
    <div class="flex gap-5">
      <CustomButton
        active={props.onDirection == TripDirectionEnum.going}
        text="Aller"
        onClick={props.onClickGoing}
      />

      <CustomButton
        text="Retour"
        onClick={props.onClickComing}
        active={props.onDirection == TripDirectionEnum.coming}
      />
    </div>
  );
}

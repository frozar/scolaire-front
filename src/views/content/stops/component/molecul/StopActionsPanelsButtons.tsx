import { Accessor, Setter, Show } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import { TripEntity } from "../../../../../_entities/trip.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { StopPanels } from "../template/StopDetails";
import StopDetailsPanelsButton from "./StopDetailsPanelsButton";

interface StopActionsPanelsButtonsProps {
  stop: StopType;
  onPanel: Accessor<StopPanels>;
  setOnPanel: Setter<StopPanels>;
  toggleInAddQuantity: () => void;
}

export function StopActionsPanelsButtons(props: StopActionsPanelsButtonsProps) {
  return (
    <div class="stop-details-actions">
      <StopDetailsPanelsButton
        onPanel={props.onPanel}
        setOnPanel={props.setOnPanel}
        NbSchool={props.stop.associated.length as number}
        NbTrips={TripEntity.getStopTrips(props.stop.id as number).length}
      />

      <Show when={props.onPanel() == "grades"}>
        <ButtonIcon icon={<PlusIcon />} onClick={props.toggleInAddQuantity} />
      </Show>
    </div>
  );
}

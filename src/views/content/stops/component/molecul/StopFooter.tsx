import { Show } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import { StopStore } from "../../../../../_stores/stop.store";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import { stopDetails } from "../template/StopDetails";
interface StopFooterProps {
  editItem: boolean;
  toggleEdit: () => void;
}

export function StopFooter(props: StopFooterProps) {
  return (
    <Show when={props.editItem}>
      <BoardFooterActions
        previousStep={{
          callback: () => props.toggleEdit(),
          label: "annuler",
        }}
        nextStep={{
          callback: async () => {
            const response = await StopStore.update(stopDetails() as StopType);
            if (response) props.toggleEdit();
          },
          label: "enregistrer",
        }}
      />
    </Show>
  );
}

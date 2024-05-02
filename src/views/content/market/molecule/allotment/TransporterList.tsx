import { For, createSignal, onMount } from "solid-js";
import { TransporterType } from "../../../../../_entities/transporter.entity";
import { TransporterStore } from "../../../../../_stores/transporter.store";
import { CirclePlusIcon } from "../../../../../icons/CirclePlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { TransporterItem } from "./TransporterItem";

interface AllotmentTransporterListProps {
  allotmentId: number;
}

export function TransporterList(props: AllotmentTransporterListProps) {
  const [transporters, setTransporters] = createSignal<TransporterType[]>([]);

  onMount(() => {
    setTransporters(
      TransporterStore.get().filter((t) => t.allotmentId == props.allotmentId)
    );
  });

  function deleteTransporter(transport: TransporterType) {
    setTransporters((prev) => {
      return prev.filter((cost) => cost != transport);
    });
  }

  function addtransporter() {
    console.log(props.allotmentId);
    console.log(transporters());
  }

  return (
    <div>
      <div class="flex gap-4 pt-2">
        <p>Ajouter un transporteur</p>
        <ButtonIcon icon={<CirclePlusIcon />} onClick={addtransporter} />
      </div>
      <div class="allotment-cost-list">
        <For each={transporters()}>
          {(item) => <TransporterItem delete={deleteTransporter} item={item} />}
        </For>
      </div>
    </div>
  );
}

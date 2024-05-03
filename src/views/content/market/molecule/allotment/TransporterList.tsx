import { For, Setter, createSignal, onMount } from "solid-js";
import { AllotmentType } from "../../../../../_entities/allotment.entity";
import { TransporterType } from "../../../../../_entities/transporter.entity";
import { TransporterService } from "../../../../../_services/transporter.service";
import { TransporterStore } from "../../../../../_stores/transporter.store";
import { CirclePlusIcon } from "../../../../../icons/CirclePlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { TransporterItem } from "./TransporterItem";

interface AllotmentTransporterListProps {
  allotment: AllotmentType;
  allotmentSetter: Setter<AllotmentType>;
}

export function TransporterList(props: AllotmentTransporterListProps) {
  const [transporters, setTransporters] = createSignal<TransporterType[]>([]);

  onMount(() => {
    setTransporters(
      TransporterStore.get().filter((t) => t.allotmentId == props.allotment.id)
    );
    // eslint-disable-next-line solid/reactivity
    props.allotmentSetter((prev) => {
      return { ...prev, transporters: transporters() };
    });
  });

  function editTransporter(
    oldTransport: TransporterType,
    newTransport: TransporterType
  ) {
    setTransporters((prev) => {
      return prev.map((item) => {
        if (item == oldTransport) return newTransport;
        return item;
      });
    });

    // eslint-disable-next-line solid/reactivity
    props.allotmentSetter((prev) => {
      return { ...prev, transporters: transporters() };
    });
  }

  async function deleteTransporter(transport: TransporterType) {
    if (transport.id) await TransporterService.deleteTransporter(transport.id);

    setTransporters((prev) => {
      return prev.filter((cost) => cost != transport);
    });
    // eslint-disable-next-line solid/reactivity
    props.allotmentSetter((prev) => {
      return { ...prev, transporters: transporters() };
    });
  }

  function addtransporter() {
    const newObj: TransporterType = {
      id: 0,
      name: "",
      type: "",
      allotmentId: props.allotment.id,
      vehicles: [],
    };
    setTransporters((prev) => {
      return [...prev, newObj];
    });
    // eslint-disable-next-line solid/reactivity
    props.allotmentSetter((prev) => {
      return { ...prev, transporters: transporters() };
    });
  }

  return (
    <div>
      <div class="flex gap-4 pt-2">
        <p>Ajouter un transporteur</p>
        <ButtonIcon icon={<CirclePlusIcon />} onClick={addtransporter} />
      </div>
      <div class="allotment-cost-list">
        <For each={transporters()}>
          {(item) => (
            <TransporterItem
              edit={editTransporter}
              delete={deleteTransporter}
              item={item}
            />
          )}
        </For>
      </div>
    </div>
  );
}

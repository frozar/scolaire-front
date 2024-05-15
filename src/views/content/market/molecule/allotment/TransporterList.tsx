import { For, Setter, createSignal, onMount } from "solid-js";
import { AllotmentType } from "../../../../../_entities/allotment.entity";
import { TransporterType } from "../../../../../_entities/transporter.entity";
import { CirclePlusIcon } from "../../../../../icons/CirclePlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { setTranspoterToDelete } from "./AllotmentTab";
import { TransporterItem } from "./TransporterItem";
import "./TransporterList.css";

interface AllotmentTransporterListProps {
  allotment: AllotmentType;
  allotmentSetter: Setter<AllotmentType>;
}

export function TransporterList(props: AllotmentTransporterListProps) {
  const [transporters, setTransporters] = createSignal<TransporterType[]>([]);

  onMount(() => {
    setTransporters(props.allotment.transporters);
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
    if (transport.id)
      setTranspoterToDelete((prev) => {
        return [...prev, transport.id as number];
      });

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
      costs: [],
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
      <div class="transporter-list-header">
        <p>Ajouter un transporteur</p>
        <ButtonIcon icon={<CirclePlusIcon />} onClick={addtransporter} />
      </div>
      <div class="transporter-list-items">
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
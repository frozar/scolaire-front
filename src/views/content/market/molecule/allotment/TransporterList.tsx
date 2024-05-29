import { Accessor, For, Setter, Show, createSignal, onMount } from "solid-js";
import { AllotmentType } from "../../../../../_entities/allotment.entity";
import { TransporterType } from "../../../../../_entities/transporter.entity";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { CirclePlusIcon } from "../../../../../icons/CirclePlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { setTranspoterToDelete } from "./AllotmentTab";
import { TransporterItem } from "./TransporterItem";
import { TransporterItemEdit } from "./TransporterItemEdit";
import "./TransporterList.css";

interface AllotmentTransporterListProps {
  allotmentSetter: Setter<AllotmentType>;
  transporters: TransporterType[];
  allotmentId: number;
}

type LocalTransporterType = {
  content: Accessor<TransporterType>;
  setContent: Setter<TransporterType>;
  inEdit: Accessor<boolean>;
  setInEdit: Setter<boolean>;
};

export function TransporterList(props: AllotmentTransporterListProps) {
  const [localTransporters, setLocalTransporters] = createSignal<
    LocalTransporterType[]
  >([]);

  onMount(() => {
    setLocalTransporters(
      props.transporters.map((t) => {
        const [content, setContent] = createSignal<TransporterType>({
          costs: t.costs,
          name: t.name,
          type: t.type,
          vehicles: t.vehicles,
          allotmentId: t.allotmentId,
          id: t.id,
        });

        const [inEdit, setInEdit] = createSignal(false);
        const localTransporter = {
          content,
          setContent,
          inEdit,
          setInEdit,
        };

        return localTransporter;
      })
    );
  });

  function localTransporterToTransporter() {
    const list: TransporterType[] = [];
    localTransporters().forEach((t) =>
      list.push({
        costs: t.content().costs,
        name: t.content().name,
        type: t.content().type,
        vehicles: t.content().vehicles,
        allotmentId: t.content().allotmentId,
        id: t.content().id,
      })
    );
    return list;
  }

  function enableEdit(transporter: LocalTransporterType) {
    const transporterToEdit = localTransporters().find(
      (v) => v.content() == transporter.content()
    );
    if (transporterToEdit) transporterToEdit.setInEdit(true);
  }

  function disableEdit(transporter: LocalTransporterType) {
    const transporterToEdit = localTransporters().find(
      (v) => v.content() == transporter.content()
    );
    if (transporterToEdit) transporterToEdit.setInEdit(false);
  }

  function updateTransporter(toEdit: TransporterType, edited: TransporterType) {
    const transporterToEdit = localTransporters().find(
      (v) => v.content().id === toEdit.id && v.content().name === toEdit.name
    );

    if (transporterToEdit) {
      transporterToEdit.setContent(edited);
      transporterToEdit.setInEdit(false);
    }

    // eslint-disable-next-line solid/reactivity
    props.allotmentSetter((prev) => {
      return { ...prev, transporters: localTransporterToTransporter() };
    });
  }

  async function deleteTransporter(transport: LocalTransporterType) {
    if (transport.content().id)
      setTranspoterToDelete((prev) => {
        return [...prev, transport.content().id as number];
      });

    setLocalTransporters((prev) => {
      return prev.filter((t) => t.content() != transport.content());
    });

    // eslint-disable-next-line solid/reactivity
    props.allotmentSetter((prev) => {
      return { ...prev, transporters: localTransporterToTransporter() };
    });
  }

  function addtransporter() {
    const [content, setContent] = createSignal<TransporterType>({
      id: 0,
      name: "",
      type: "",
      allotmentId: props.allotmentId,
      vehicles: [],
      costs: [],
    });

    const [inEdit, setInEdit] = createSignal(true);
    const newTransporter = {
      content,
      setContent,
      inEdit,
      setInEdit,
    };

    setLocalTransporters((prev) => {
      return [...prev, newTransporter];
    });

    // eslint-disable-next-line solid/reactivity
    props.allotmentSetter((prev) => {
      return { ...prev, transporters: localTransporterToTransporter() };
    });
  }

  return (
    <div>
      <div class="transporter-list-header">
        <p>Ajouter un transporteur</p>
        <ButtonIcon icon={<CirclePlusIcon />} onClick={addtransporter} />
      </div>
      <div class="transporter-list-items">
        <For each={localTransporters()}>
          {(item) => (
            <CardWrapper>
              <Show
                when={!item.inEdit()}
                fallback={
                  <TransporterItemEdit
                    cancel={() => disableEdit(item)}
                    costs={item.content().costs}
                    id={item.content().id as number}
                    allotmentId={item.content().allotmentId as number}
                    name={item.content().name}
                    submitCb={updateTransporter}
                    type={item.content().type}
                    vehicles={item.content().vehicles}
                  />
                }
              >
                <TransporterItem
                  costLenght={item.content().costs.length}
                  deleteCb={() => deleteTransporter(item)}
                  enableEditCb={() => enableEdit(item)}
                  name={item.content().name}
                  type={item.content().type}
                  vehicleLenght={item.content().vehicles.length}
                />
              </Show>
            </CardWrapper>
          )}
        </For>
      </div>
    </div>
  );
}

import { Accessor, Setter, createSignal, onMount } from "solid-js";
import {
  AllotmentCostType,
  AllotmentType,
} from "../../../../_entities/allotment.entity";
import { TransporterType } from "../../../../_entities/transporter.entity";
import { setTranspoterToDelete } from "../../market/molecule/allotment/AllotmentTab";
import { AllotmentEditHeader } from "../atom/AllotmentEditHeader";
import { AllotmentEditContent } from "./AllotmentEditContent";

interface AllotmentEditMenuProps {
  allotment: AllotmentType;
  allotmentSetter: Setter<AllotmentType>;
  toggleEdit: () => void;
}

type LocalTransporterType = {
  content: Accessor<TransporterType>;
  setContent: Setter<TransporterType>;
  inEdit: Accessor<boolean>;
  setInEdit: Setter<boolean>;
};

export default function AllotmentEditMenu(props: AllotmentEditMenuProps) {
  const [localTransporters, setLocalTransporters] = createSignal<
    LocalTransporterType[]
  >([]);

  onMount(() => {
    setLocalTransporters(
      props.allotment.transporters.map((t) => {
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

  function addTransporter() {
    const [content, setContent] = createSignal<TransporterType>({
      id: 0,
      name: "",
      type: "Titulaire",
      allotmentId: props.allotment.id,
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

  function updateTransporter(
    originalTransporter: TransporterType,
    edited: TransporterType
  ) {
    const transporterToEdit = localTransporters().find(
      (v) =>
        v.content().id === originalTransporter.id &&
        v.content().name === originalTransporter.name
    );

    if (transporterToEdit) {
      transporterToEdit.setContent(edited);
      transporterToEdit.setInEdit(false);
    }
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

  function confirm(costs: AllotmentCostType[]) {
    // eslint-disable-next-line solid/reactivity
    props.allotmentSetter((prev) => {
      return {
        ...prev,
        transporters: localTransporterToTransporter(),
        vehicleCost: costs,
      };
    });
    props.toggleEdit();
  }

  return (
    <div>
      <AllotmentEditHeader title={props.allotment.name} />
      <AllotmentEditContent
        color={props.allotment.color}
        name={props.allotment.name}
        allotmentSetter={props.allotmentSetter}
        costs={props.allotment.vehicleCost}
        addCb={addTransporter}
        deleteCb={deleteTransporter}
        disableEditCb={disableEdit}
        enableEditCb={enableEdit}
        transporters={localTransporters()}
        updateCb={updateTransporter}
        confirmCb={confirm}
      />
    </div>
  );
}

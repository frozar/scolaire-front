import { Accessor, Setter, createSignal, onMount } from "solid-js";
import {
  AllotmentCostType,
  AllotmentType,
} from "../../../../_entities/allotment.entity";
import { TransporterType } from "../../../../_entities/transporter.entity";
import { CircleCheckIcon } from "../../../../icons/CircleCheckIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { AllotmentCostList } from "../../market/molecule/allotment/AllotmentCostList";
import { setTranspoterToDelete } from "../../market/molecule/allotment/AllotmentTab";
import { TransporterList } from "../../market/molecule/allotment/TransporterList";
import "./AllotmentEditContent.css";
import { AllotmentEditInputs } from "./AllotmentEditInputs";

interface AllotmentEditContentProps {
  allotment: AllotmentType;
  allotmentSetter: Setter<AllotmentType>;
  toggleMenu: () => void;
}

type LocalTransporterType = {
  content: Accessor<TransporterType>;
  setContent: Setter<TransporterType>;
  inEdit: Accessor<boolean>;
  setInEdit: Setter<boolean>;
};

export function AllotmentEditContent(props: AllotmentEditContentProps) {
  const [costs, setCosts] = createSignal<AllotmentCostType[]>([]);
  const [localTransporters, setLocalTransporters] = createSignal<
    LocalTransporterType[]
  >([]);

  onMount(() => {
    setCosts(props.allotment.vehicleCost);
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

  function onNameChange(value: string) {
    props.allotmentSetter((prev) => {
      return { ...prev, name: value };
    });
  }

  function onColorChange(value: string) {
    props.allotmentSetter((prev) => {
      return { ...prev, color: value };
    });
  }

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
      type: "",
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

  function updateTransporter(toEdit: TransporterType, edited: TransporterType) {
    const transporterToEdit = localTransporters().find(
      (v) => v.content().id === toEdit.id && v.content().name === toEdit.name
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

  function confirm() {
    // eslint-disable-next-line solid/reactivity
    props.allotmentSetter((prev) => {
      return {
        ...prev,
        transporters: localTransporterToTransporter(),
        vehicleCost: costs(),
      };
    });
    props.toggleMenu();
  }

  return (
    <div class="allotment-edit-border">
      <AllotmentEditInputs
        color={props.allotment.color}
        name={props.allotment.name}
        onColorInput={onColorChange}
        onNameInput={onNameChange}
      />
      <div class="allotment-edit-cost">
        <AllotmentCostList costList={costs()} costSetter={setCosts} />
      </div>
      <div class="allotment-edit-transporter">
        <TransporterList
          transporters={localTransporters()}
          addCb={addTransporter}
          deleteCb={deleteTransporter}
          updateCb={updateTransporter}
          enableEditCb={enableEdit}
          disableEditCb={disableEdit}
        />
      </div>
      <div class="allotment-edit-buttons">
        <ButtonIcon icon={<CircleCheckIcon />} onClick={confirm} />
      </div>
    </div>
  );
}

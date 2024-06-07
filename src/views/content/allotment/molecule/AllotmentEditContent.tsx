import { Accessor, Setter, createSignal, onMount } from "solid-js";
import {
  AllotmentCostType,
  AllotmentType,
} from "../../../../_entities/allotment.entity";
import { TransporterType } from "../../../../_entities/transporter.entity";
import { CircleCheckIcon } from "../../../../icons/CircleCheckIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { AllotmentCostList } from "../../market/molecule/allotment/AllotmentCostList";
import TransporterList from "../../market/molecule/allotment/TransporterList";
import "./AllotmentEditContent.css";
import { AllotmentEditInputs } from "./AllotmentEditInputs";

interface AllotmentEditContentProps {
  color: string;
  name: string;
  transporters: LocalTransporterType[];
  costs: AllotmentCostType[];
  allotmentSetter: Setter<AllotmentType>;
  addCb: () => void;
  deleteCb: (item: LocalTransporterType) => void;
  enableEditCb: (item: LocalTransporterType) => void;
  disableEditCb: (item: LocalTransporterType) => void;
  updateCb: (toEdit: TransporterType, edited: TransporterType) => void;
  confirmCb: (costs: AllotmentCostType[]) => void;
}

type LocalTransporterType = {
  content: Accessor<TransporterType>;
  setContent: Setter<TransporterType>;
  inEdit: Accessor<boolean>;
  setInEdit: Setter<boolean>;
};

export function AllotmentEditContent(props: AllotmentEditContentProps) {
  const [costs, setCosts] = createSignal<AllotmentCostType[]>([]);

  onMount(() => {
    setCosts(props.costs);
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

  return (
    <div class="allotment-edit-border">
      <AllotmentEditInputs
        color={props.color}
        name={props.name}
        onColorInput={onColorChange}
        onNameInput={onNameChange}
      />
      <div class="allotment-edit-cost">
        <AllotmentCostList costList={costs()} costSetter={setCosts} />
      </div>
      <div class="allotment-edit-transporter">
        <TransporterList
          transporters={props.transporters}
          addCb={props.addCb}
          deleteCb={props.deleteCb}
          updateCb={props.updateCb}
          enableEditCb={props.enableEditCb}
          disableEditCb={props.disableEditCb}
        />
      </div>
      <div class="allotment-edit-buttons">
        <ButtonIcon
          icon={<CircleCheckIcon />}
          onClick={() => props.confirmCb(costs())}
        />
      </div>
    </div>
  );
}

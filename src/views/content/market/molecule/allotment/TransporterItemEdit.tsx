import { Setter } from "solid-js";
import { TransporterType } from "../../../../../_entities/transporter.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import { CircleCheckIcon } from "../../../../../icons/CircleCheckIcon";
import { CircleXMarkIcon } from "../../../../../icons/CircleXMarkIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { VehicleList } from "./VehicleList";

interface TransporterItemEditProps {
  item: TransporterType;
  itemSetter: Setter<TransporterType>;
  cancel: () => void;
  submit: () => void;
}

export function TransporterItemEdit(props: TransporterItemEditProps) {
  function onTypeChange(value: number) {
    props.itemSetter((prev) => {
      return { ...prev, type: idToType(value) };
    });
  }

  function onNamechange(value: string) {
    props.itemSetter((prev) => {
      return { ...prev, name: value };
    });
  }

  return (
    <div class="flex justify-between">
      <div>
        <div>
          <label class="inputs-label-offset" for="name">
            Nom :
          </label>
          <input
            value={props.item.name}
            type="text"
            id="name"
            onInput={(e) => onNamechange(e.target.value)}
          />
        </div>
        <div>
          <label class="inputs-label-offset">Type :</label>
          <SelectInput
            options={[
              { value: 0, text: "Titulaire" },
              { value: 1, text: "Co-traitant" },
              { value: 2, text: "Sous-traitant" },
            ]}
            onChange={(e) => onTypeChange(Number(e))}
            defaultValue={typeToId(props.item.type)}
            variant="borderless"
          />
        </div>
        <VehicleList
          transporter={props.item}
          transporterSetter={props.itemSetter}
        />
      </div>
      <div class="flex gap-2">
        <ButtonIcon icon={<CircleXMarkIcon />} onClick={props.cancel} />
        <ButtonIcon icon={<CircleCheckIcon />} onClick={props.submit} />
      </div>
    </div>
  );
}

function idToType(id: number) {
  switch (id) {
    case 0:
      return "Titulaire";
    case 1:
      return "Co-traitant";
    case 2:
      return "Sous-traitant";
    default:
      return "";
  }
}

function typeToId(type: string) {
  switch (type) {
    case "Titulaire":
      return 0;
    case "Co-traitant":
      return 1;
    case "Sous-traitant":
      return 2;
    default:
      return "";
  }
}

import { onChangeEventType } from "./importDialogContent";

interface LabeledInputRadioProps {
  id: string;
  value: string;
  name: string;
  labelName: string;
  onChange: (event: onChangeEventType) => void;
}

export default function (props: LabeledInputRadioProps) {
  return (
    <div>
      <input
        type="radio"
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={(e) => props.onChange(e)}
      />
      <label for={props.id}>{props.labelName}</label>
    </div>
  );
}

import "./labeledInputRadio.css";

interface LabeledInputRadioProps {
  id: string;
  value: string;
  name: string;
  labelName: string;
  checked?: boolean;
  onChange: (value: string) => void;
}

export default function (props: LabeledInputRadioProps) {
  return (
    <div class="input-radio">
      <input
        type="radio"
        id={props.id}
        name={props.name}
        value={props.value}
        checked={props.checked}
        onChange={(event) => props.onChange(event.target.value)}
      />
      <label for={props.id}>{props.labelName}</label>
    </div>
  );
}

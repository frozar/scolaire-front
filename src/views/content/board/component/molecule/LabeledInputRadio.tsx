import "./labeledInputRadio.css";

interface LabeledInputRadioProps {
  id: string;
  value: string;
  name: string;
  labelName: string;
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
        onChange={(event) => props.onChange(event.target.value)}
      />
      <label class="input-radio-label" for={props.id}>
        {props.labelName}
      </label>
    </div>
  );
}

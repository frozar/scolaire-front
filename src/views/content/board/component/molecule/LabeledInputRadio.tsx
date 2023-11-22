interface LabeledInputRadioProps {
  id: string;
  value: string;
  name: string;
  labelName: string;
  onChange: (value: string) => void;
}

export default function (props: LabeledInputRadioProps) {
  return (
    <div>
      <input
        type="radio"
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      />
      <label for={props.id}>{props.labelName}</label>
    </div>
  );
}

interface RadioButtonProps {
  disabled: boolean;
  name: string;
  checked: boolean;
  value: string;
  onChange: (event: Event & { target: HTMLInputElement }) => void;
}

export function RadioButton(props: RadioButtonProps) {
  const onChange = (event: Event & { target: HTMLInputElement }) =>
    props.onChange(event);
  return (
    <input
      name={"radio-" + props.name}
      class="my-[5px]"
      type="radio"
      disabled={props.disabled}
      onChange={onChange}
      value={props.value}
      checked={props.checked}
    />
  );
}

import { createEffect, createSignal } from "solid-js";
import CalendarIcon from "../../icons/CalendarIcon";
import "./DateInput.css";

interface DateInputProps {
  defaultValue?: Date;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
}

export function DateInput(props: DateInputProps) {
  const [dateInputRef, setDateInputRef] = createSignal<HTMLInputElement>();
  const [defaultDate, setDefaultDate] = createSignal<string>();
  const label = () => props.label ?? "Entrer une date";

  createEffect(() => {
    if (props.defaultValue)
      setDefaultDate(props.defaultValue.toISOString().substring(0, 10));
    else setDefaultDate(label);
  });

  function openInputDateDialog() {
    if (!props.disabled) dateInputRef()?.showPicker();
  }

  function onChange() {
    const date = new Date(dateInputRef()?.value as string);
    props.onChange(date);
    setDefaultDate(date.toISOString().substring(0, 10));
  }

  return (
    <div class="date-input-container">
      <label>{label()}</label>
      <button onClick={openInputDateDialog} class="input-date-btn">
        {defaultDate()}
        <div class="w-4">
          <CalendarIcon />
        </div>
      </button>
      <input
        onChange={onChange}
        type="date"
        min={props.minDate ? props.minDate.toISOString().substring(0, 10) : ""}
        max={props.maxDate ? props.maxDate.toISOString().substring(0, 10) : ""}
        ref={setDateInputRef}
        value={props.defaultValue?.toISOString().substring(0, 10)}
        class="input-date-btn-hidden-input"
        disabled={props.disabled ?? false}
      />
    </div>
  );
}

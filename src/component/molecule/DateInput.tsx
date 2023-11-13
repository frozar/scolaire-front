import { createSignal } from "solid-js";
import CalendarIcon from "../../icons/CalendarIcon";
import "./DateInput.css";

interface DateInputProps {
  defaultValue?: Date;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: Date) => void;
}

export function DateInput(props: DateInputProps) {
  const [dateInputRef, setDateInputRef] = createSignal<HTMLInputElement>();
  const label = props.label ?? "Entrer une date";
  const [defaultDate, setDefaultDate] = createSignal(
    props.defaultValue
      ? props.defaultValue?.toISOString().substring(0, 10)
      : label
  );

  function openInputDateDialog() {
    dateInputRef()?.showPicker();
  }

  function onChange() {
    props.onChange(new Date(dateInputRef()?.value as string));
    setDefaultDate(dateInputRef()?.value as string);
  }

  function minDate() {
    if (props.minDate) {
      const month = props.minDate.getMonth() + 1;
      const day = props.minDate.getDate();
      return `${props.minDate.getFullYear()}-${
        month < 10 ? "0" + month : month
      }-${day < 10 ? "0" + day : day}`;
    } else return "";
  }

  function maxDate() {
    if (props.maxDate) {
      const month = props.maxDate.getMonth() + 1;
      const day = props.maxDate.getDate();

      return `${props.maxDate.getFullYear()}-${
        month < 10 ? "0" + month : month
      }-${day < 10 ? "0" + day : day}`;
    } else return "";
  }

  return (
    <div class="date-input-container">
      <label>{label}</label>
      <button onClick={openInputDateDialog} class="input-date-btn">
        {defaultDate()}
        <div class="w-4">
          <CalendarIcon />
        </div>
      </button>
      <input
        onChange={onChange}
        type="date"
        min={minDate()}
        max={maxDate()}
        ref={setDateInputRef}
        class="input-date-btn-hidden-input"
      />
    </div>
  );
}

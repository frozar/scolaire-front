import { createEffect, createSignal } from "solid-js";
import CalendarIcon from "../../icons/CalendarIcon";
import { CalendarUtils } from "../../views/content/calendar/calendar.utils";
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
  const [defaultDate, setDefaultDate] = createSignal<Date>(
    CalendarUtils.stringToDate(Date())
  );
  const label = () => props.label ?? "Entrer une date";

  createEffect(() => {
    if (props.defaultValue) setDefaultDate(props.defaultValue);
  });

  createEffect(() => {
    if (props.minDate && defaultDate()) {
      if (defaultDate() < props.minDate) {
        props.onChange(props.minDate);
        setDefaultDate(props.minDate);
      }
    }
  });

  createEffect(() => {
    console.log("La");

    if (props.maxDate) {
      if (defaultDate()! > props.maxDate) {
        props.onChange(props.maxDate);
        setDefaultDate(props.maxDate);
      }
    }
  });

  function openInputDateDialog() {
    if (!props.disabled) dateInputRef()?.showPicker();
  }

  function onChange() {
    const date = new Date(dateInputRef()?.value as string);
    props.onChange(date);
    setDefaultDate(date);
  }

  return (
    <div class="date-input-container">
      <label>{label()}</label>
      <button onClick={openInputDateDialog} class="input-date-btn">
        {defaultDate()
          ? CalendarUtils.dateToString(defaultDate())
          : props.label}
        <div class="w-4">
          <CalendarIcon />
        </div>
      </button>
      <input
        onChange={onChange}
        type="date"
        ref={setDateInputRef}
        value={CalendarUtils.dateToString(props.defaultValue)}
        class="input-date-btn-hidden-input"
        disabled={props.disabled ?? false}
      />
    </div>
  );
}

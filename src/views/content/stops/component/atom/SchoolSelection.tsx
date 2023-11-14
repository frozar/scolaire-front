import { For } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import "./SchoolSelection.css";

interface SchoolSelectionProps {
  schools: SchoolType[];
  isModifying: boolean;
  selector: {
    value: number | string;
    disabled: boolean;
  };
  // refSelectSetter: Setter<HTMLSelectElement>;
  onChange: (element: HTMLSelectElement) => void;
}

// function onChangeSchoolSelect(element: HTMLSelectElement) {
//   const school = getSchools().filter(
//     (school) => school.id == parseInt(element.value)
//   )[0];
// }

export default function (props: SchoolSelectionProps) {
  // onMount(() => {
  //   if (props.isModifying) {
  //     console.log("selected option");
  //     props.refSelectSetter((prev) => {
  //       const ref = prev;
  //       ref.disabled = true;
  //       return ref;
  //     });
  //   } else {
  //     props.refSelectSetter((prev) => {
  //       const ref = prev;
  //       ref.value = "default";
  //       return ref;
  //     });
  //   }
  // });

  return (
    <select
      name="school-select"
      onChange={(e) => props.onChange(e.target)}
      // onChange={(e) => onChangeSchoolSelect(e.target)}
      // ref={props.refSelectSetter}
      disabled={props.selector.disabled}
      class="school-selection"
    >
      <option value="default">Choisir une école</option>
      <For each={props.schools}>
        {(school) => (
          <option
            selected={school.id == props.selector.value}
            value={school.id}
          >
            {school.name}
          </option>
        )}
      </For>
    </select>
  );
}

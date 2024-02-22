import { minuteToTime } from "../organism/VoirieDay";
import "./GradeSelection.css";

interface VoirieTimeItem {
  opt: number;
}

export function VoirieTimeItem(props:VoirieTimeItem) {
  return (
    <>
      <div>
        <div class="-ml-16 -mt-2.5 w-12 pr-2 text-right text-xs leading-5 text-gray-400">
          {minuteToTime(props.opt * 60, true)}
        </div>
      </div>
      <div />
    </>
  );
}



// export default function (props: GradeSelectProps) {
//   return (
//     <select
//       class="grade-selection"
//       onChange={(e) => props.onChange(e.target)}
//       disabled={props.selector.disabled}
//     >
//       <option value="default">Sélectionner une grade</option>
//       <For each={props.grades}>
//         {(grade) => (
//           <option
//             selected={grade.id == Number(props.selector.value)}
//             value={grade.id}
//           >
//             {grade.name}
//           </option>
//         )}
//       </For>
//     </select>
//   );
// }

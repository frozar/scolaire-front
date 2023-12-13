import { For } from "solid-js";
import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";
import { QuantityMatriceType } from "../../../../../utils/quantity.utils";
import { CalendarUtils } from "../../../calendar/calendar.utils";

// TODO refacto
export function QuantityTable(props: { matrice: QuantityMatriceType }) {
  const goingQuantity = (day: CalendarDayEnum) => {
    return props.matrice[day].going.quantity;
  };

  const comingQuantity = (day: CalendarDayEnum) => {
    return props.matrice[day].coming.quantity;
  };

  return (
    <table class="text-xs w-full">
      <thead>
        <tr>
          <th class="text-start">Jours</th>
          <th>Aller</th>
          <th>Retour</th>
        </tr>
      </thead>
      <tbody>
        <For each={Object.values(CalendarDayEnum)}>
          {(day) => (
            <tr>
              <td>{CalendarUtils.dayToFrench(day)}</td>
              <td class="text-center">{goingQuantity(day)}</td>
              <td class="text-center">{comingQuantity(day)}</td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}

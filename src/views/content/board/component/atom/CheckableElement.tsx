import { Show } from "solid-js";
import { GradeUtils } from "../../../../../utils/grade.utils";
import { onTripDirection } from "../organism/AssignDaysAndDirectionToTrip";

export type CheckableElementType = {
  name: string;
  id: number;
  checked: boolean;
  display: boolean;
  onChange: (e: CheckableEventType, indice: number) => void;
};

export type CheckableEventType = Event & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};

export function CheckableElement(props: {
  content: CheckableElementType;
  indice: number;
  displayQuantity: boolean;
}) {
  const remainingQuantity = () =>
    GradeUtils.getRemainingQuantityForDirection(
      props.content.id,
      onTripDirection()
    );
  const isElementDisabled = () =>
    remainingQuantity() == 0 && props.displayQuantity;

  return (
    <Show when={props.content.display}>
      <div class="flex items-center">
        <input
          id="comments"
          name="comments"
          type="checkbox"
          disabled={isElementDisabled()}
          checked={props.content.checked}
          onChange={(e) => {
            props.content.onChange(e, props.indice);
          }}
          class="h-4 w-5 mr-4 rounded border-gray-300 text-green-base focus:ring-green-base"
        />
        <p
          classList={{
            "text-gray-base": isElementDisabled(),
            "text-current": !isElementDisabled(),
          }}
        >
          {props.content.name}
        </p>
        <Show when={props.displayQuantity}>
          <p
            class="ml-4"
            classList={{
              "text-gray-base": isElementDisabled(),
              "text-current": !isElementDisabled(),
            }}
          >
            {remainingQuantity()} élèves restants
          </p>
        </Show>
      </div>
    </Show>
  );
}

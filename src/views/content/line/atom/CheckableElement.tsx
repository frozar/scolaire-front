import { Show } from "solid-js";
import { GradeUtils } from "../../../../utils/grade.utils";
import { onTripDirection } from "../../board/component/organism/AssignDaysAndDirectionToTrip";

export type CheckableEventType = Event & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};

export function CheckableElement(props: {
  name: string;
  id: number;
  checked: boolean;
  onChange: () => void;
  displayQuantity: boolean;
}) {
  const remainingQuantity = () =>
    GradeUtils.getRemainingQuantityForDirection(props.id, onTripDirection());
  const isElementDisabled = () =>
    remainingQuantity() == 0 && props.displayQuantity;

  return (
    <div class="flex items-center">
      <input
        id={"checkable-element-" + props.id}
        name={"checkable-element-" + props.id}
        type="checkbox"
        disabled={isElementDisabled()}
        checked={props.checked}
        onChange={(e) => {
          props.onChange();
        }}
        class="h-4 w-5 mr-4 rounded border-gray-300 text-green-base focus:ring-green-base"
      />
      <label
        for={"checkable-element-" + props.id}
        classList={{
          "text-gray-base": isElementDisabled(),
          "text-current": !isElementDisabled(),
        }}
      >
        {props.name}
      </label>

      {/* TODO voir l'utilité */}
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
  );
}

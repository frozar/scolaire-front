import { For, createSignal } from "solid-js";
import { BoundingBox } from "../../../../_entities/map.entity";
import { defaultBoundingBox } from "../../../../_stores/map.store";
import InputNumber from "../../stops/component/atom/InputNumber";

export const [newBoundingBox, setNewBoundingBox] =
  createSignal<BoundingBox>(defaultBoundingBox);

export function BoudingBoxSettings() {
  // * To append settings in Travel Time section please add the setting from SettingsEnum into travedTime var

  return (
    <For each={["max_X", "max_Y", "min_X", "min_Y", "srid"]}>
      {(opt) => (
        <div class="setting-item">
          <p>{opt}</p>
          <InputNumber
            placeholder={opt}
            selector={{
              value: Number(newBoundingBox()[opt]),
              disabled: false,
            }}
            onChange={(element) => {
              const val = Number(element.value);
              newBoundingBox()[opt] = val;
              setNewBoundingBox(newBoundingBox());
            }}
          />
        </div>
      )}
    </For>
  );
}

import { createSignal } from "solid-js";
import { FlatGraphicType } from "../_entities/flatGraphic.entity";

export const [getFlatGraphics, setFlatGraphics] = createSignal<
  FlatGraphicType[]
>([]);

export namespace FlatGraphicStore {
  export function set(
    graphics:
      | FlatGraphicType[]
      | ((prev: FlatGraphicType[]) => FlatGraphicType[])
  ) {
    setFlatGraphics(graphics);
    getFlatGraphics().sort((a, b) => a.name.localeCompare(b.name));
  }

  export function get() {
    return getFlatGraphics();
  }
}

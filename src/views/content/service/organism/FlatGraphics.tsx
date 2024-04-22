import { For, createSignal, onMount } from "solid-js";
import { FlatGraphicStore } from "../../../../_stores/flatGraphics.store";
import { SurroundedPlusIcon } from "../../../../icons/SurroundedPlusIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { FlatGraphicItem } from "./FlatGraphicItem";
import "./FlatGraphics.css";

export const [currentGraphic, setCurrentGraphic] = createSignal(0);

export function FlatGraphics() {
  onMount(() => {
    setCurrentGraphic(FlatGraphicStore.get()[0].id as number);
  });

  return (
    <div>
      <div class="flat-graphic-list">
        <For each={FlatGraphicStore.get()}>
          {(item) => (
            <FlatGraphicItem
              currentGraphic={currentGraphic()}
              graphicItem={item}
              graphicSetter={setCurrentGraphic}
            />
          )}
        </For>
        <ButtonIcon
          class="flat-graphic-list-add"
          icon={<SurroundedPlusIcon />}
          onClick={() => console.log("add")}
        />
      </div>
    </div>
  );
}

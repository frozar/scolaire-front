import { For, Show, createSignal, onMount } from "solid-js";
import { FlatGraphicType } from "../../../../_entities/flatGraphic.entity";
import { FlatGraphicService } from "../../../../_services/flatGraphic.service";
import { FlatGraphicStore } from "../../../../_stores/flatGraphics.store";
import { SurroundedPlusIcon } from "../../../../icons/SurroundedPlusIcon";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { FlatGraphicAddMenu } from "../molecule/FlatGraphicAddMenu";
import { FlatGraphicItem } from "./FlatGraphicItem";
import "./FlatGraphics.css";

export const [currentGraphic, setCurrentGraphic] = createSignal(0);

export function FlatGraphics() {
  const [isAddMenuOpened, setIsAddMenuOpened] = createSignal(false);

  onMount(() => {
    setCurrentGraphic(FlatGraphicStore.get()[0].id as number);
  });

  async function submit(graphic: FlatGraphicType) {
    if (!graphic.name || !graphic.color || graphic.name == "") return;

    enableSpinningWheel();
    const created = await FlatGraphicService.create(graphic);
    setIsAddMenuOpened(false);
    const tmp = FlatGraphicStore.get();
    tmp.push(created);
    FlatGraphicStore.set([]);
    FlatGraphicStore.set(tmp);
    disableSpinningWheel();

    addNewGlobalSuccessInformation(created.name + " a été créé");
  }

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
          onClick={() => setIsAddMenuOpened(true)}
        />
      </div>
      <Show when={isAddMenuOpened()}>
        <FlatGraphicAddMenu
          cancel={() => setIsAddMenuOpened(false)}
          submit={submit}
        />
      </Show>
    </div>
  );
}

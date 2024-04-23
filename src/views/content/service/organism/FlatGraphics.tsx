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
  const [isEditMenuOpened, setIsEditMenuOpened] = createSignal(false);

  onMount(() => {
    setCurrentGraphic(FlatGraphicStore.get()[0].id as number);
  });

  async function submitAdd(graphic: FlatGraphicType) {
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

  async function submitEdit(graphic: FlatGraphicType) {
    if (!graphic.name || !graphic.color || graphic.name == "") return;

    enableSpinningWheel();
    const created = await FlatGraphicService.update(graphic);
    setIsEditMenuOpened(false);
    const tmp = FlatGraphicStore.get().filter(
      (graph) => graph.id != created.id
    );
    tmp.push(created);
    FlatGraphicStore.set([]);
    FlatGraphicStore.set(tmp);
    disableSpinningWheel();

    addNewGlobalSuccessInformation(created.name + " a été modifié");
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
              editButtonClicked={setIsEditMenuOpened}
            />
          )}
        </For>
        <ButtonIcon
          class="flat-graphic-list-add"
          icon={<SurroundedPlusIcon />}
          onClick={() => setIsAddMenuOpened(true)}
        />
      </div>
      <Show when={isAddMenuOpened() && !isEditMenuOpened()}>
        <FlatGraphicAddMenu
          cancel={() => setIsAddMenuOpened(false)}
          submit={submitAdd}
        />
      </Show>
      <Show when={!isAddMenuOpened() && isEditMenuOpened()}>
        <FlatGraphicAddMenu
          graphic={
            FlatGraphicStore.get().filter((a) => a.id == currentGraphic())[0]
          }
          cancel={() => setIsEditMenuOpened(false)}
          submit={submitEdit}
        />
      </Show>
    </div>
  );
}

import { For, createSignal, onMount } from "solid-js";
import { FlatGraphicStore } from "../../../../_stores/flatGraphics.store";
import Button from "../../../../component/atom/Button";
import { FlatGraphicItem } from "./FlatGraphicItem";
import { ServiceLeftBoard } from "./ServiceLeftBoard";
import { Services } from "./Services";

export function FlatGraphics() {
  const [currentGraphic, setCurrentGraphic] = createSignal(0);

  onMount(() => {
    setCurrentGraphic(FlatGraphicStore.get()[0].id as number);
  });

  return (
    <div>
      <div>
        <For each={FlatGraphicStore.get()}>
          {(item) => (
            <FlatGraphicItem
              currentGraphic={currentGraphic()}
              graphicItem={item}
              graphicSetter={setCurrentGraphic}
            />
          )}
        </For>
        <Button
          label={"+"}
          onClick={() => console.log("add")}
          active={true}
          variant="outline"
          size="3xl"
        />
      </div>
      <div class="service-template">
        {/* <ServiceList /> */}
        <ServiceLeftBoard />
        <Services />
      </div>
    </div>
  );
}

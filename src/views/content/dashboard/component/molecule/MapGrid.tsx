import { For, onCleanup, onMount } from "solid-js";
import MapCard from "./MapCard";
import { UserMapType } from "../../../../../type";
import { CarteToDeleteType } from "../../Dashboard";

import { clickOnButton } from "../../../../../utils";
import "./MapGrid.css";

export function shouldExit(event: MouseEvent) {
  return !event.target || clickOnButton(event.target as HTMLElement);
}

interface MapGridProps {
  mapList: UserMapType[];
  handleClickDelete: (mapToDelete: CarteToDeleteType) => void;
}

export let isCtrlPressed = false;

// Handle multi-selection
function ctrlHandler({ ctrlKey }: KeyboardEvent) {
  if (ctrlKey) {
    isCtrlPressed = true;
  } else {
    isCtrlPressed = false;
  }
}

const shortcuts = [ctrlHandler];

export default function (props: MapGridProps) {
  onMount(() => {
    for (const handler of shortcuts) {
      document.body.addEventListener("keydown", handler);
      document.body.addEventListener("keyup", handler);
    }
  });

  onCleanup(() => {
    for (const handler of shortcuts) {
      document.body.removeEventListener("keydown", handler);
      document.body.removeEventListener("keyup", handler);
    }
  });

  return (
    <div class="map-grid">
      <For each={props.mapList}>
        {(item) => {
          return (
            <MapCard
              mapCard={item}
              select={(event) => {
                if (shouldExit(event)) {
                  return;
                }

                item.setIsSelected(true);
              }}
              unselect={() => {
                item.setIsSelected(false);
              }}
              handleDblClick={(event) => {
                if (shouldExit(event)) {
                  return;
                }
                item.setIsActive((bool) => !bool);
              }}
              handleClickDelete={() => {
                props.handleClickDelete({
                  id: item.id,
                  title: item.name,
                });
              }}
            />
          );
        }}
      </For>
    </div>
  );
}

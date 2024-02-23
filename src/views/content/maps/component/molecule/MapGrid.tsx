import { For, onCleanup, onMount } from "solid-js";
import { UserMapType } from "../../../../../type";
import { CarteToDeleteType } from "../../Maps";
import MapCard from "./MapCard";

import { useStateGui } from "../../../../../StateGui";
import { clickOnButton } from "../../../../../utils";
import "./MapGrid.css";

export function shouldExit(event: MouseEvent) {
  return !event.target || clickOnButton(event.target as HTMLElement);
}

const [, { setActiveMapId }] = useStateGui();

interface MapGridProps {
  mapList: UserMapType[];
  handleClickDelete: (mapToDelete: CarteToDeleteType) => void;
}

export let isCtrlPressed = false;
export let isShiftPressed = false;
const lastCardSelectedDefault = -1;
let lastCardSelected = lastCardSelectedDefault;

export function resetLastCardSelected() {
  lastCardSelected = lastCardSelectedDefault;
}

// Handle multi-selection
function keyboardHandler({ ctrlKey, shiftKey }: KeyboardEvent) {
  if (ctrlKey) {
    isCtrlPressed = true;
  } else {
    isCtrlPressed = false;
  }
  if (shiftKey) {
    isShiftPressed = true;
  } else {
    isShiftPressed = false;
  }
}

const shortcuts = [keyboardHandler];

//TODO function MapGrid
export default function (props: MapGridProps) {
  onMount(() => {
    for (const handler of shortcuts) {
      // document.body.addEventListener("keydown", handler);
      // document.body.addEventListener("keyup", handler);
    }
  });

  onCleanup(() => {
    for (const handler of shortcuts) {
      // document.body.removeEventListener("keydown", handler);
      // document.body.removeEventListener("keyup", handler);
    }
  });

  return (
    <div class="map-grid">
      <For each={props.mapList}>
        {(item, index) => {
          return (
            <MapCard
              mapCard={item}
              select={(event) => {
                if (shouldExit(event)) {
                  return;
                }

                if (isShiftPressed) {
                  if (lastCardSelected == lastCardSelectedDefault) {
                    item.setIsSelected(true);
                    lastCardSelected = index();
                  } else {
                    const start = Math.min(lastCardSelected, index());
                    const end = Math.max(lastCardSelected, index());
                    props.mapList.map((map, i) =>
                      map.setIsSelected(start <= i && i <= end)
                    );
                  }
                } else {
                  if (isCtrlPressed) {
                    item.setIsSelected((bool) => !bool);
                  } else {
                    item.setIsSelected(true);
                    lastCardSelected = index();
                  }
                }
              }}
              unselect={() => {
                item.setIsSelected(false);
              }}
              handleDblClick={(event) => {
                if (shouldExit(event)) {
                  return;
                }

                props.mapList.map((map) => map.setIsActive(map.id === item.id));
                setActiveMapId(item.id);
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

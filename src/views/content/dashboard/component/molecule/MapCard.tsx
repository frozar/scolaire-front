import { IoPencil } from "solid-icons/io";
import { FaRegularTrashCan } from "solid-icons/fa";
import MapCardTitle from "../atom/MapCardTitle";
import MapCardPreview from "../atom/MapCardPreview";

import Pellet from "../../../../../component/atom/Pellet";
import { Show, onCleanup, onMount } from "solid-js";
import { UserMapType } from "../../../../../type";

import ClickOutside from "../../../../../component/ClickOutside";
import { assertIsNode } from "../../../../../utils";

import "./MapCard.css";
import {
  isCtrlPressed,
  isShiftPressed,
  resetLastCardSelected,
} from "./MapGrid";
// import { isCtrlPressed } from "../../shortcut";
export interface MapCardProps {
  mapCard: UserMapType;
  select: (event: MouseEvent) => void;
  unselect: () => void;
  handleDblClick: (event: MouseEvent) => void;
  handleClickDelete: () => void;
}

export default function (props: MapCardProps) {
  let refMapCard!: HTMLDivElement;
  onMount(() => {
    refMapCard.addEventListener("dblclick", props.handleDblClick);
  });

  onCleanup(() => {
    refMapCard.removeEventListener("dblclick", props.handleDblClick);
  });

  return (
    <div
      ref={refMapCard}
      class="map-card-container"
      classList={{ selected: props.mapCard.isSelected() }}
      onClick={(event: MouseEvent) => props.select(event)}
      use:ClickOutside={(e: MouseEvent) => {
        if (!refMapCard || !e.target || isCtrlPressed || isShiftPressed) {
          return;
        }

        assertIsNode(e.target);
        if (!refMapCard.contains(e.target)) {
          resetLastCardSelected();
          props.unselect();
        }
      }}
    >
      <Show when={props.mapCard.isActive()}>
        <div class="pellet-container">
          <Pellet />
        </div>
      </Show>
      <div class="flex flex-row justify-between items-center">
        <div class="invisible">
          <IoPencil />
        </div>
        <div class="w-full">
          <MapCardTitle title={props.mapCard.name} />
        </div>
        <button
          disabled
          class="button-edit"
          onClick={() => {
            console.log("TODO: call editTitle");
          }}
        >
          <IoPencil />
        </button>
      </div>
      <div class="mt-1 relative rounded">
        <MapCardPreview preview={"/map.png"} />
        <div class="button-delete-container">
          <button
            class="button-delete"
            onClick={() => props.handleClickDelete()}
          >
            <FaRegularTrashCan />
          </button>
        </div>
      </div>
    </div>
  );
}

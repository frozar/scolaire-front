import { IoPencil } from "solid-icons/io";
import { FaRegularTrashCan } from "solid-icons/fa";
import MapCardTitle from "../atom/MapCardTitle";
import MapCardPreview from "../atom/MapCardPreview";

import "./MapCard.css";
import Pellet from "../../../../../component/atom/Pellet";
import { Show } from "solid-js";

export interface MapCardProps {
  title: string;
  openMap?: (id: number) => void;
  handleClickDelete: () => void;
  isActive: boolean;
}

export default function (props: MapCardProps) {
  return (
    <div class="map-card-container">
      <Show when={props.isActive}>
        <div class="fixed">
          <Pellet />
        </div>
      </Show>
      <div class="flex flex-row justify-between items-center">
        <div class="invisible">
          <IoPencil />
        </div>
        <div class="w-full">
          <MapCardTitle title={props.title} />
        </div>
        <button
          disabled
          class="button-edit"
          onClick={() => {
            console.log("call editMapModal");
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

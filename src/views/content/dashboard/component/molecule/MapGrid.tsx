import { For } from "solid-js";
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

export default function (props: MapGridProps) {
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

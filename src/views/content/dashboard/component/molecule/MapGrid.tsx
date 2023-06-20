import { For } from "solid-js";
import MapCard from "./MapCard";
import { UserMapType } from "../../../../../type";
import { CarteToDeleteType } from "../../Dashboard";

import "./MapGrid.css";

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
              title={item.name}
              handleClickDelete={() => {
                props.handleClickDelete({
                  id: item.id,
                  title: item.name,
                });
              }}
              isActive={item.isActive}
            />
          );
        }}
      </For>
    </div>
  );
}

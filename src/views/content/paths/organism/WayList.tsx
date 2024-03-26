import { For, createSignal } from "solid-js";
import { WayType } from "../../../../_entities/way.entity";
import { WayListItem } from "../molecule/WayListItem";

interface WayListProps {
  canDelete: boolean;
  ways: WayType[];
  deleteFunction: (way: WayType) => void;
}

export const [isWayListEdit, setIsWayListEdit] = createSignal(false);

export function WayList(props: WayListProps) {
  return (
    <div>
      <p>Chemins sélectionnés</p>
      <For each={props.ways}>
        {(item) => {
          return (
            <WayListItem
              canDelete={props.canDelete}
              way={item}
              delete={props.deleteFunction}
            />
          );
        }}
      </For>
    </div>
  );
}

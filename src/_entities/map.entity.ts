import { Accessor, Setter, createSignal } from "solid-js";
import { useStateGui } from "../StateGui";

const [, { getActiveMapId }] = useStateGui();

export class MapEntity {
  /**
   * Build the type MapType from db type MapDBType
   * @param dbMaps
   * @returns the map MapType
   */
  static build(dbMap: MapDBType): MapType {
    const [isActive, setIsActive] = createSignal(false);
    const [isSelected, setIsSelected] = createSignal(false);

    if (getActiveMapId() === dbMap.id) {
      setIsActive(true);
    }
    return {
      id: dbMap.id,
      name: dbMap.name,
      isActive,
      isSelected,
      setIsSelected,
      setIsActive,
    };
  }
}

export type MapDBType = {
  id: number;
  name: string;
};

export type MapType = {
  id: number;
  name: string;
  //TODO revoir la pertinence de mettre les Acessor et Setter ici
  isSelected: Accessor<boolean>;
  isActive: Accessor<boolean>;
  setIsSelected: Setter<boolean>;
  setIsActive: Setter<boolean>;
};

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
      organisation_id: dbMap.organisation_id,
      bounding_box: dbMap.bounding_box,
      isActive,
      isSelected,
      setIsSelected,
      setIsActive,
      createAt: new Date(dbMap.created_at),
    };
  }
}

export type MapDBType = {
  id: number;
  name: string;
  created_at: Date;
  organisation_id: number;
  bounding_box: BoundingBox;
};

export type BoundingBox = {
  min_X: number;
  min_Y: number;
  max_X: number;
  max_Y: number;
  srid: number;
};

export type MapType = {
  id: number;
  name: string;
  createAt: Date;
  organisation_id: number;
  bounding_box: BoundingBox;

  //TODO revoir la pertinence de mettre les Acessor et Setter ici
  isSelected: Accessor<boolean>;
  isActive: Accessor<boolean>;
  setIsSelected: Setter<boolean>;
  setIsActive: Setter<boolean>;
};

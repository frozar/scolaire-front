export namespace RoadEntity {
  export function build(dbRoad: RoadDBType) {
    const list: RoadWayType[] = [];
    dbRoad.ways.forEach((item) => {
      list.push({
        id: item.way[0].id,
        name: item.way[0].name,
        osm_id: item.way[0].osm_id,
      });
    });
    return {
      id: dbRoad.id,
      color: dbRoad.color,
      name: dbRoad.name,
      ways: list,
    };
  }
}

export type RoadType = {
  id?: number;
  color: string;
  name: string;
  ways: RoadWayType[];
};

export type RoadWayType = {
  id?: number;
  name: string;
  osm_id: number;
};

export type RoadDBType = {
  id?: number;
  color: string;
  name: string;
  ways: RoadWayDBType[];
};

type RoadWayDBType = {
  way_id: number;
  way: DBWayType[];
};

export type DBWayType = {
  id?: number;
  name: string;
  osm_id: number;
  nodes: NodeDBType[];
};

export type NodeDBType = {
  id?: number;
  lat: number;
  long: number;
};

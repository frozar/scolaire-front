export namespace PathEntity {
  export function build(dbRoad: PathDBType) {
    const list: PathWayType[] = [];
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

export type PathType = {
  id?: number;
  color: string;
  name: string;
  ways: PathWayType[];
};

export type PathWayType = {
  id?: number;
  name: string;
  osm_id: number;
  //TODO charger les nodes ?
};

export type PathDBType = {
  id?: number;
  color: string;
  name: string;
  ways: PathWayDBType[];
};

type PathWayDBType = {
  way_id: number;
  //TODO renommer en "ways" et changer dans xano
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

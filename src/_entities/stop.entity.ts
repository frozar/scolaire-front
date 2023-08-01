import { EntityUtils, LocationDBType } from "./_utils.entity";

export class StopEntity {
  static build(dbStop: StopDBType): StopType {
    return {
      id: dbStop.id,
      lon: dbStop.location.data.lng,
      lat: dbStop.location.data.lat,
      name: dbStop.name,
      selected: false,
      schools: formatSchoolsOfStop(dbStop.schools),
    };
  }

  static dbFormat(
    stop: Omit<StopType, "id" | "selected">
  ): Omit<StopDBType, "id"> {
    return {
      name: stop.name,
      location: EntityUtils.builLocationPoint(stop.lon, stop.lat),
      schools: [],
    };
  }
}

const formatSchoolsOfStop = (schoolOfStopDB: SchoolOfStopDBType[]) => {
  return schoolOfStopDB.map((item) => {
    return {
      id: item.school.id,
      name: item.school.name,
      quantity: item.quantity,
    };
  });
};

export type StopType = {
  id: number;
  name: string;
  lon: number;
  lat: number;
  //TODO utility of this prop ?
  selected: boolean;
  schools: SchoolOfStopType[];
};

export type SchoolOfStopType = {
  id: number;
  name: string;
  quantity: number;
};

export type StopDBType = {
  id: number;
  name: string;
  location: LocationDBType;
  schools: SchoolOfStopDBType[];
};

type SchoolOfStopDBType = {
  school: {
    id: number;
    name: string;
  };
  quantity: number;
};

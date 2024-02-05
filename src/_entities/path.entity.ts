import { createSignal } from "solid-js";
import { NatureEnum } from "../type";
import { COLOR_GREEN_BASE } from "../views/content/map/constant";
import { TripPointType, TripType } from "./trip.entity";

const [paths, setPaths] = createSignal<PathType[]>([]);

export type PathType = {
  id?: number;
  name: string;
  points: PathPointType[];
  color: string;
  grades: number[];
  schools: number[];
};

export type PathPointType = {
  id: number;
  nature: NatureEnum;
};

export namespace PathEntity {
  export function build(path: PathType): PathType {
    // * If the path doesnt exist in the path list, add it
    if (!paths().find((path_) => path_.id == path.id))
      setPaths((prev) => [...prev, path]);

    return path;
  }

  export function formatFromTrip(
    trip: TripType,
    name = "Nom par défaut"
  ): PathType {
    return {
      name: name,
      color: trip.color,
      points: PathEntity.formatPoint(trip.tripPoints),
      grades: trip.grades.map((grade) => grade.id) as number[],
      schools: trip.schools.map((school) => school.id),
    };
  }

  export function formatPoint(tripPoint: TripPointType[]): PathPointType[] {
    return tripPoint.map((point) => {
      return {
        id: point.id,
        grades: point.grades.map((grade) => grade.gradeId),
        nature: point.nature,
      };
    });
  }

  export function defaultPath(): PathType {
    return {
      name: "Nom par défaut",
      color: COLOR_GREEN_BASE,
      grades: [],
      points: [],
      schools: [],
    };
  }
}

import { Accessor, Setter, createSignal } from "solid-js";
import { SchoolStore } from "../_stores/school.store";
import { getStops } from "../_stores/stop.store";
import { COLOR_DEFAULT_LINE } from "../views/content/map/constant";
import { GradeDBType, GradeEntity, GradeType } from "./grade.entity";
import { SchoolType } from "./school.entity";
import { StopType } from "./stop.entity";
import { TripDBType, TripEntity, TripType } from "./trip.entity";

export class BusLineEntity {
  static build(dbLine: LineDBType): LineType {
    const stops: StopType[] = BusLineEntity.dbStopsToStopsType(dbLine);
    const trips = dbLine.trips.map((dbTrip) => TripEntity.build(dbTrip));
    const grades =
      dbLine.grades != undefined
        ? dbLine.grades.map((grade) => GradeEntity.build(grade))
        : [];
    const schools: SchoolType[] = SchoolStore.getAllOfGrades(grades);

    const [selected, setSelected] = createSignal<boolean>(false);
    const [color, setColor] = createSignal<string>("#" + dbLine.color);

    return {
      id: dbLine.id,
      schools,
      stops,
      trips,
      grades,
      name: dbLine.name,
      color: color,
      setColor: setColor,
      selected: selected,
      setSelected: setSelected,
    };
  }

  static dbStopsToStopsType(dbLine: LineDBType) {
    const dbLineStopid = dbLine.stops.map((school) => school.stop_id);
    const stops: StopType[] = getStops().filter((item) =>
      dbLineStopid.includes(item.id)
    );
    return stops;
  }

  static defaultBusLine(): LineType {
    const [color, setColor] = createSignal<string>(COLOR_DEFAULT_LINE);
    const [selected, setSelected] = createSignal<boolean>(false);

    return {
      color: color,
      setColor: setColor,
      schools: [],
      stops: [],
      grades: [],
      trips: [],
      name: "my default name",
      selected: selected,
      setSelected: setSelected,
    };
  }

  static dbFormat(line: LineType): {
    color: string;
    name: string;
    stops: number[];
    grades: number[];
    trips: TripType[];
  } {
    const name = line.name ? line.name : "";
    return {
      color: formatColorForDB(line.color()),
      name: name,
      stops: line.stops.map((stop) => stop.id),
      trips: line.trips,
      grades: line.grades.map((grade) => grade.id as number),
    };
  }

  static dbPartialFormat(line: Partial<LineType>): Partial<LineDBType> {
    let output = {};

    if (line.color) {
      output = { ...output, color: formatColorForDB(line.color()) };
    }

    if (line.name) {
      output = {
        ...output,
        name: line.name,
      };
    }
    // TODO
    // if (line.points) {
    //   output = {
    //     ...output,
    //     bus_line_stop: formatBusLinePointDBType(line.points),
    //   };
    // }

    return output;
  }
}

function formatColorForDB(color: string) {
  if (color.startsWith("#")) {
    return color.replace("#", "");
  }
  return color;
}

/**
 * Format the bus line associated points
 * @param points
 * @returns
 */

export type LineType = {
  id?: number;
  schools: SchoolType[];
  stops: StopType[];
  trips: TripType[];
  grades: GradeType[];
  name?: string;
  color: Accessor<string>;
  setColor: Setter<string>;
  //TODO delete the select (not used)
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
};

export type LineDBType = {
  id: number;
  name: string;
  color: string;
  stops: { stop_id: number }[];
  grades: GradeDBType[];
  trips: TripDBType[];
  // paths: PathType[];
};

import { Accessor, Setter, createSignal } from "solid-js";
import { getSchools } from "../_stores/school.store";
import { getStops } from "../_stores/stop.store";
import { COLOR_DEFAULT_LINE } from "../views/content/map/constant";
import { GradeDBType, GradeEntity, GradeType } from "./grade.entity";
import { PathType } from "./path.entity";
import { SchoolType } from "./school.entity";
import { StopType } from "./stop.entity";
import { TripDBType, TripEntity, TripType } from "./trip.entity";

export class BusLineEntity {
  static build(dbLine: LineDBType): LineType {
    const schools: SchoolType[] = BusLineEntity.dbSchoolsToSchoolType(dbLine);
    const stops: StopType[] = BusLineEntity.dbStopsToStopsType(dbLine);
    const trips = dbLine.trips.map((dbTrip) => TripEntity.build(dbTrip));
    const grades =
      dbLine.grades != undefined
        ? dbLine.grades.map((grade) => GradeEntity.build(grade))
        : [];

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
      paths: dbLine.paths,
    };
  }

  static dbStopsToStopsType(dbLine: LineDBType) {
    const dbLineStopid = dbLine.stops.map((school) => school.stop_id);
    const stops: StopType[] = getStops().filter((item) =>
      dbLineStopid.includes(item.id)
    );
    return stops;
  }

  static dbSchoolsToSchoolType(dbLine: LineDBType) {
    const dbLineSchoolid = dbLine.schools.map((school) => school.school_id);
    const schools: SchoolType[] = getSchools().filter((item) =>
      dbLineSchoolid.includes(item.id)
    );
    return schools;
  }

  static defaultBusLine(): LineType {
    const [color, setColor] = createSignal<string>(COLOR_DEFAULT_LINE);
    const [selected, setSelected] = createSignal<boolean>(false);

    return {
      color: color,
      setColor: setColor,
      stops: [],
      schools: [],
      grades: [],
      trips: [],
      name: "my default name",
      selected: selected,
      setSelected: setSelected,
      paths: [],
    };
  }

  static dbFormat(line: LineType): {
    color: string;
    name: string;
    schools: number[];
    stops: number[];
    grades: number[];
    trips: TripType[];
  } {
    const name = line.name ? line.name : "";
    return {
      color: formatColorForDB(line.color()),
      name: name,
      schools: line.schools.map((school) => school.id),
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
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
  paths: PathType[];
};

export type LineDBType = {
  id: number;
  name: string;
  color: string;
  schools: { school_id: number }[];
  stops: { stop_id: number }[];
  grades: GradeDBType[];
  trips: TripDBType[];
  paths: PathType[];
};

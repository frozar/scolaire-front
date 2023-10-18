import { Accessor, Setter, createSignal } from "solid-js";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { COLOR_DEFAULT_LINE } from "../views/content/map/constant";
import { RaceDBType, RaceEntity, RaceType } from "./race.entity";
import { SchoolType } from "./school.entity";
import { StopType } from "./stop.entity";

export class BusLineEntity {
  static build(dbLine: LineDBType): LineType {
    const schools: SchoolType[] = BusLineEntity.dbSchoolsToSchoolType(dbLine);

    const stops: StopType[] = BusLineEntity.dbStopsToStopsType(dbLine);

    const courses = dbLine.courses.map((dbRace) =>
      RaceEntity.build(dbRace.course)
    );

    const [selected, setSelected] = createSignal<boolean>(false);
    const [color, setColor] = createSignal<string>("#" + dbLine.color);

    return {
      id: dbLine.id,
      schools,
      stops,
      courses,
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
      courses: [],
      name: "my default name",
      selected: selected,
      setSelected: setSelected,
    };
  }

  static dbFormat(line: LineType): {
    color: string;
    name: string;
    schools: number[];
    stops: number[];
    courses: RaceType[];
  } {
    const name = line.name ? line.name : "";
    return {
      color: formatColorForDB(line.color()),
      name: name,
      schools: line.schools.map((school) => school.id),
      stops: line.stops.map((stop) => stop.id),
      courses: line.courses,
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
  courses: RaceType[];
  name?: string;
  color: Accessor<string>;
  setColor: Setter<string>;

  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
};

export type LineDBType = {
  id: number;
  name: string;
  color: string;
  schools: { school_id: number }[];
  stops: { stop_id: number }[];
  courses: { course_id: number; course: RaceDBType }[];
};

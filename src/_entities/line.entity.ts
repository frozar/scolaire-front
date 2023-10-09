import { Accessor, Setter, createSignal } from "solid-js";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { COLOR_DEFAULT_LINE } from "../views/content/map/constant";
import { BusCourseEntity, CourseDBType, CourseType } from "./course.entity";
import { SchoolType } from "./school.entity";
import { StopType } from "./stop.entity";

// const [, { getLineUnderConstruction, setLineUnderConstruction }] =
//   useStateAction();

export class BusLineEntity {
  static build(dbLine: LineDBType): LineType {
    console.log("dbLine", dbLine);
    console.log("getSchools()", getSchools());
    const dbLineSchoolid = dbLine.schools.map((school) => school.school_id);
    const filteredShools: SchoolType[] = getSchools().filter((item) =>
      dbLineSchoolid.includes(item.id)
    );

    if (filteredShools.length == 0) {
      //TODO Error log to improve
      console.log("Error : La liste des établissments est incorrecte ou vide");
    }

    const schools = filteredShools;

    // const filteredStops: StopType[] = getStops().filter((item) =>
    //   dbLine.stops.includes(item.id)
    // );

    const dbLineStopid = dbLine.stops.map((school) => school.stop_id);
    const filteredStops: StopType[] = getStops().filter((item) =>
      dbLineStopid.includes(item.id)
    );

    if (filteredStops.length == 0) {
      //TODO Error log to improve
      console.log(
        "Error : La liste des points de ramassage est incorrecte ou vide"
      );
    }

    const stops = filteredStops;

    // const filteredCourses: CourseType[] = getCourses().filter((item) =>
    //   dbLine.courses.map((course) => course.id).includes(item.id)
    // );

    const courses = dbLine.courses.map((dbCourse) =>
      BusCourseEntity.build(dbCourse.course)
    );

    if (courses.length == 0) {
      //TODO Error log to improve
      console.log(" La liste des courses de bus est incorrecte ou vide");
    }

    // const courses = filteredCourses;

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

  static dbFormat(line: LineType): Omit<LineDBType, "id"> {
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
  courses: CourseType[];
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
  courses: { course_id: number; course: CourseDBType }[];
};

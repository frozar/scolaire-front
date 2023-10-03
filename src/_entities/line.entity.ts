import { Accessor, Setter, createSignal } from "solid-js";
import { getCourses } from "../views/content/map/component/organism/Courses";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { COLOR_DEFAULT_LINE } from "../views/content/map/constant";
import { CourseType } from "./course.entity";
import { SchoolType } from "./school.entity";
import { StopType } from "./stop.entity";

// const [, { getLineUnderConstruction, setLineUnderConstruction }] =
//   useStateAction();

export class BusLineEntity {
  static build(dbData: LineDBType): LineType {
    console.log("la", dbData);
    const filteredShools: SchoolType[] = getSchools().filter((item) =>
      dbData.schools.map((school) => school.id).includes(item.id)
    );

    if (filteredShools.length == 0) {
      //TODO Error log to improve
      console.log("Error : La liste des établissments est incorrecte ou vide");
    }

    const schools = filteredShools;

    const filteredStops: StopType[] = getStops().filter((item) =>
      dbData.stops.map((stop) => stop.id).includes(item.id)
    );

    if (filteredStops.length == 0) {
      //TODO Error log to improve
      console.log(
        "Error : La liste des points de ramassage est incorrecte ou vide"
      );
    }

    const stops = filteredStops;

    const filteredCourses: CourseType[] = getCourses().filter((item) =>
      dbData.courses.map((course) => course.id).includes(item.id)
    );

    if (filteredCourses.length == 0) {
      //TODO Error log to improve
      console.log("Error : La liste des courses de bus est incorrecte ou vide");
    }

    const courses = filteredCourses;

    const [selected, setSelected] = createSignal<boolean>(false);
    const [color, setColor] = createSignal<string>("#" + dbData.color);

    return {
      id: dbData.id,
      schools,
      stops,
      courses,
      name: dbData.name,
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
      schools: line.schools,
      stops: line.stops,
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
  schools: SchoolType[];
  stops: StopType[];
  courses: CourseType[];
};

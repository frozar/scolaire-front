import { setStops } from "../views/content/map/component/organism/StopPoints";
import {
  setStopDetailsItem,
  stopDetailsItem,
} from "../views/content/stops/component/organism/StopDetails";
import { ClasseType } from "./classe.entity";

export namespace ClassStudentToSchool {
  export function build(
    classToSchool: ClassToSchoolTypeFormated
  ): ClassToSchoolTypeFormatedWithUsedQuantity {
    return {
      ...classToSchool,
      usedQuantity: 0,
    };
  }

  export function dbFormat(
    classStudentToSchool: Omit<ClassStudentToSchoolType, "id">
  ): Omit<ClassToSchoolDBType, "id"> {
    return {
      stop_id: classStudentToSchool.stopId,
      school_id: classStudentToSchool.schoolId,
      quantity: classStudentToSchool.quantity,
      class_id: classStudentToSchool.classId,
    };
  }

  function updateStopDetailsItem(stopId: number) {
    if (stopDetailsItem() != undefined && stopDetailsItem()?.id == stopId) {
      setStopDetailsItem((prev) => {
        let currentItem;
        if (prev != undefined) currentItem = { ...prev };
        return currentItem;
      });
    }
  }

  export function appendToStop(
    classItem: ClassToSchoolTypeFormatedWithUsedQuantity,
    stopId: number
  ) {
    setStops((prev) => {
      if (prev != undefined) {
        const stops = [...prev];
        const indexOf = stops.findIndex((prev) => prev.id == stopId);
        stops[indexOf].associated.push(classItem);
        return stops;
      }
      return prev;
    });
    updateStopDetailsItem(stopId);
  }

  export function removeFromStop(
    classStudentToSchoolID: number,
    stopId: number
  ) {
    setStops((prev) => {
      if (prev != undefined) {
        const stops = [...prev];
        const indexOfStop = stops.findIndex((prev) => prev.id == stopId);
        const indexOfClassStudent = stops[indexOfStop].associated.findIndex(
          (prev) => prev.id == classStudentToSchoolID
        );
        delete stops[indexOfStop].associated[indexOfClassStudent];
        return stops;
      }
      return prev;
    });
    updateStopDetailsItem(stopId);
  }
}

export type ClassToSchoolTypeFormated = {
  id: number;
  quantity: number;
  class: Omit<
    ClasseType,
    "afternoonStart" | "afternoonEnd" | "morningEnd" | "morningStart"
  >;
  school: {
    id?: number;
    name: string;
  };
  stop: {
    id?: number;
    name: string;
  };
};

export type ClassToSchoolTypeFormatedWithUsedQuantity = {
  usedQuantity: number;
} & ClassToSchoolTypeFormated;

export type ClassToSchoolDBType = {
  id: number;
  stop_id: number;
  school_id: number;
  quantity: number;
  class_id: number;
};

export type ClassStudentToSchoolType = {
  id: number;
  stopId: number;
  schoolId: number;
  quantity: number;
  classId: number;
};

export type CSVFormatStudentToSchool = {
  quantity: 4;
  school_name: string;
  stop_name: string;
};

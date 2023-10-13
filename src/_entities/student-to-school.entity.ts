import {
  getStops,
  setStops,
} from "../views/content/map/component/organism/StopPoints";
import {
  setStopDetailsItem,
  stopDetailsItem,
} from "../views/content/stops/component/organism/StopDetails";
import { AssociatedDBPointType, AssociatedPointType } from "./_utils.entity";

export namespace ClassStudentToSchoolEntity {
  export function build(
    classToSchool: AssociatedDBPointType
  ): AssociatedPointType {
    return {
      name: classToSchool.entity.name,
      id: classToSchool.entity.id,
      studentSchoolId: classToSchool.id,
      classId: classToSchool.class_id,
      quantity: classToSchool.quantity,
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
      const stopIndex = getStops().findIndex((prev) => prev.id == stopId);
      const stop = getStops()[stopIndex];

      setStopDetailsItem((prev) => {
        if (prev != undefined) {
          const currentItem = { ...stop };
          return currentItem;
        }
        return prev;
      });
    }
  }

  export function appendToStop(classItem: AssociatedPointType, stopId: number) {
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

        stops[indexOfStop].associated = stops[indexOfStop].associated.filter(
          (prev) => prev.studentSchoolId != classStudentToSchoolID
        );
        return stops;
      }
      return prev;
    });
    updateStopDetailsItem(stopId);
  }

  // TODO lucas à placer dans Stop component
  export function updateFromStop(
    classStudentToSchool: AssociatedPointType,
    stopId: number
  ) {
    setStops((prev) => {
      if (prev != undefined) {
        const stops = [...prev];
        const indexOfStop = stops.findIndex((prev) => prev.id == stopId);
        const indexOfClass = stops[indexOfStop].associated.findIndex(
          (prev) => prev.id == classStudentToSchool.id
        );
        stops[indexOfStop].associated[indexOfClass].quantity =
          classStudentToSchool.quantity;
        return stops;
      }
      return prev;
    });
    updateStopDetailsItem(stopId);
  }
}

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

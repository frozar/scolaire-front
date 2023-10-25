import { Accessor, Setter, createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { NatureEnum } from "../type";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getTrips } from "../views/content/map/component/organism/Trips";
import {
  AssociatedStopType,
  EntityUtils,
  LocationDBType,
} from "./_utils.entity";
import { GradeDBType, GradeEntity, GradeType } from "./grade.entity";
import { DBAssociatedStop } from "./stop.entity";

const [, { nextLeafletPointId }] = useStateGui();

export class SchoolEntity {
  static build(dbSchool: SchoolDBType): SchoolType {
    const [selected, setSelected] = createSignal<boolean>(false);
    return {
      id: dbSchool.id,
      lon: dbSchool.location.data.lng,
      lat: dbSchool.location.data.lat,
      name: dbSchool.name,
      nature: NatureEnum.school,
      //TODO Delete associated
      associated: dbSchool.grades
        .map((grade) =>
          EntityUtils.formatAssociatedClassToSchoolForSchool(
            grade.associated as DBAssociatedStop[],
            grade.id
          )
        )
        .flat(),
      grades:
        dbSchool.grades != undefined
          ? dbSchool.grades.map((grade) => GradeEntity.build(grade))
          : [],
      leafletId: nextLeafletPointId(),
      selected: selected,
      setSelected: setSelected,
    };
  }

  static dbFormat(
    school: Pick<SchoolType, "name" | "lon" | "lat">
  ): Pick<SchoolDBType, "name" | "location"> {
    return {
      name: school.name,
      location: EntityUtils.builLocationPoint(school.lon, school.lat),
    };
  }

  static dataToDB(datas: Pick<SchoolType, "name" | "lon" | "lat">[]) {
    return datas.map((data) => {
      return SchoolEntity.dbFormat({
        name: data.name,
        lat: +data.lat,
        lon: +data.lon,
      });
    });
  }

  // TODO à place dans un SchoolUtils
  static getTotalQuantity(school: SchoolType) {
    let quantity = 0;
    for (const stop of school.associated) {
      quantity += stop.quantity;
    }
    return quantity;
  }

  // TODO à place dans un SchoolUtils
  // static getRemainingQuantity(school: SchoolType) {
  //   console.log("school ===> ", school);
  //   const quantity = 0;
  //   for (const stop of school.associated) {
  //     // quantity += QuantityUtils.remaining(stop);
  //     const test = getLines()
  //       .map((line) => line.trips.map((trip) => trip.points))
  //       .flat()
  //       .flat()
  //       .map((point) => point.id)
  //       .includes(stop.stopId);
  //     // ! Fix pas forcement tout ou rien mais seulement tout ou rien sur la qté d'une grade à un stop
  //     return test ? 0 : SchoolEntity.getTotalQuantity(school);
  //   }

  //   return quantity;
  // }

  // ! clean
  static getRemainingQuantity(school: SchoolType) {
    console.log("school ===> ", school);
    // ! Faire la somme des qtys par grades (school.associated)
    const remainingQty: { [gradeId: number]: number } = {};
    school.associated.map((assoc) => {
      if (!remainingQty[assoc.gradeId]) {
        remainingQty[assoc.gradeId] = assoc.quantity;
      } else {
        remainingQty[assoc.gradeId] += assoc.quantity;
      }
    });
    console.log("remainingQty before substraction", remainingQty);
    // ! Comparer avec la somme des qtys utilisé dans les trips
    getLines()
      .map((line) => line.trips.map((trip) => trip.tripPoints))
      .flat()
      .flat()
      .map((tripPoint) => tripPoint.grades)
      .flat()
      .map((gradeTrip) => {
        if (remainingQty[gradeTrip.gradeId]) {
          remainingQty[gradeTrip.gradeId] -= gradeTrip.quantity;
        }
      });
    console.log("remainingQty after substraction", remainingQty);

    // ! Additioner les remaining qtys
    let totalRemainingQty = 0;
    Object.entries(remainingQty).forEach((key) => {
      totalRemainingQty += key[1];
    });

    return totalRemainingQty;
    // for (const key of remainingQty) {

    // }

    // let quantity = 0;
    // for (const stop of school.associated) {
    // quantity += QuantityUtils.remaining(stop);
    // const test = getLines()
    //   .map((line) => line.trips.map((trip) => trip.tripPoints))
    //   .flat()
    //   .flat()
    //   .map((tripPoints) => tripPoints.id)
    //   .includes(stop.stopId);
    // if (test) {
    //   quantity += stop.quantity;
    // }
    // ! Fix pas forcement tout ou rien mais seulement tout ou rien sur la qté d'une grade à un stop
    // return test ? 0 : SchoolEntity.getTotalQuantity(school);
    // }

    // return SchoolEntity.getTotalQuantity(school) - quantity;
  }

  // TODO à place dans un SchoolUtils
  static getSchoolTrips(currentSchoolId: number) {
    const lines = [];

    for (const line of getTrips()) {
      const _line = line.schools.filter((l) => l.id == currentSchoolId);
      if (_line.length > 0) lines.push(line);
    }

    return lines;
  }
}

export type SchoolType = {
  id: number;
  name: string;
  lon: number;
  lat: number;
  associated: AssociatedStopType[];
  nature: NatureEnum;
  grades: GradeType[];
  leafletId: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
};

export type SchoolDBType = {
  id: number;
  name: string;
  location: LocationDBType;
  grades: GradeDBType[];
};

export type LeafletShoolType = SchoolType & {
  idPoint: number;
};

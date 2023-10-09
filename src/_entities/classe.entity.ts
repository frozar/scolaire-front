import { HeureFormat } from "../views/content/schools/component/organism/ClasseBoard";

function getStringFromHeureFormat(time: HeureFormat) {
  return String(time.hour) + ":" + String(time.minutes);
}

function getHourFormatFromString(time: string) {
  return {
    hour: Number(time.split(":")[0]),
    minutes: Number(time.split(":")[1]),
  };
}

export class ClasseEntity {
  static dbFormat(classe: ClasseType): Omit<ClasseDBType, "id"> {
    return {
      school_id: classe.schoolId,
      name: classe.name,
      morning_start: getStringFromHeureFormat(classe.morningStart),
      morning_end: getStringFromHeureFormat(classe.morningEnd),
      afternoon_start: getStringFromHeureFormat(classe.afternoonStart),
      afternoon_end: getStringFromHeureFormat(classe.afternoonEnd),
    };
  }
  static build(dbData: ClasseDBType): ClasseType {
    return {
      id: dbData.id,
      schoolId: dbData.school_id,
      name: dbData.name,
      morningStart: getHourFormatFromString(dbData.morning_start),
      morningEnd: getHourFormatFromString(dbData.morning_end),
      afternoonStart: getHourFormatFromString(dbData.afternoon_start),
      afternoonEnd: getHourFormatFromString(dbData.afternoon_end),
    };
  }
}

export type ClasseDBType = {
  id: number;
  school_id: number;
  name: string;
  morning_start: string;
  morning_end: string;
  afternoon_start: string;
  afternoon_end: string;
};

export type ClasseType = {
  id?: number;
  schoolId: number; // ! Delete ? Necessaire ?
  name: string;
  morningStart: HeureFormat;
  morningEnd: HeureFormat;
  afternoonStart: HeureFormat;
  afternoonEnd: HeureFormat;
};

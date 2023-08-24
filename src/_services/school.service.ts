import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import { addNewUserInformation, disableSpinningWheel } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import {
  buildSchools,
  setSchools,
} from "../views/content/graphicage/component/organism/SchoolPoints";
import { ServiceUtils } from "./_utils.service";

export class SchoolService {
  static async getAll(): Promise<SchoolType[]> {
    const dbSchools: SchoolDBType[] = await ServiceUtils.get("/school");
    return dbSchools.map((dbSchool) => SchoolEntity.build(dbSchool));
  }

  static async importSchools(
    schools: Pick<SchoolDBType, "name" | "location">[]
  ): Promise<SchoolType[]> {
    const xano_result: SchoolDBType[] = await ServiceUtils.post(
      "/school/import",
      { schools: schools }
    );

    return xano_result.map((dbSchool) => SchoolEntity.build(dbSchool));
  }

  //TODO change Omit to Pick
  static async create(
    school: Omit<
      SchoolType,
      "id" | "selected" | "associated" | "setSelected" | "nature" | "leafletId"
    >
  ): Promise<SchoolType> {
    const data = SchoolEntity.dbFormat(school);
    const dbSchool: SchoolDBType = await ServiceUtils.post("/school", data);
    return SchoolEntity.build(dbSchool);
  }

  static async update(
    school: Omit<
      SchoolType,
      "associated" | "selected" | "setSelected" | "nature" | "leafletId"
    >
  ): Promise<SchoolType> {
    const data = SchoolEntity.dbFormat(school);
    const dbSchool: SchoolDBType = await ServiceUtils.patch(
      "/school/" + school.id,
      data
    );
    if (dbSchool == null) return dbSchool;
    return SchoolEntity.build(dbSchool);
  }

  // TODO no tested : school supression process on stand by
  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/school/" + id);
  }

  static async importEntities(
    file: File,
    onComplete?: () => void,
    onFail?: () => void
  ) {
    const regexExtention = new RegExp(".csv$");

    const fileName = file.name;

    if (!regexExtention.test(fileName)) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Fichier non reconnue. Veuillez utiliser des .csv lors de l'importation.",
      });
      disableSpinningWheel();
      onFail ? onFail() : "";
      return;
    }

    const strReg =
      "[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2}_etablissement.csv";
    const regex = new RegExp(strReg);

    if (!regex.test(file.name)) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "Nom du fichier incorrect",
      });
      disableSpinningWheel();
      onFail ? onFail() : "";
      return;
    }

    const correctHeader = ["name", "lat", "lon"];

    const parsedFile = await ServiceUtils.parseFile(file);
    if (parsedFile.meta.fields?.toString() === correctHeader.toString()) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Erreur de formatage du header. \n Veuillez utiliser le header suivant: ['name', 'lat', 'lon']",
      });
      disableSpinningWheel();
      onFail ? onFail() : "";
      return;
    }

    const data = dataToDB(
      parsedFile.data.slice(0, parsedFile.data.length - 1) as Pick<
        SchoolType,
        "name" | "lon" | "lat"
      >[] // data.length - 1 to skip the last empty line of the csv
    );

    try {
      const schools: SchoolType[] = buildSchools(
        await SchoolService.importSchools(data)
      );

      setSchools(schools);
      onComplete ? onComplete() : "";
    } catch (err) {
      console.log("Import failed", err);
      onFail ? onFail() : "";
    }

    disableSpinningWheel();
    onComplete ? onComplete() : "";
    // Papa.parse(file, {
    //   header: true,
    //   complete: async function (results) {
    //     enableSpinningWheel();
    //     console.log(results.meta.fields);
    //     const data = dataToDB(
    //       results.data.slice(0, results.data.length - 1) as {
    //         // data.length - 1 to skip the last empty line of the csv
    //         name: string;
    //         lat: string;
    //         lon: string;
    //       }[]
    //     );
    //     try {
    //       const schools: SchoolType[] = buildSchools(
    //         await SchoolService.importSchools(data)
    //       );

    //       setSchools(schools);
    //       onComplete ? onComplete() : "";
    //     } catch (err) {
    //       console.log("Import failed", err);
    //       onFail ? onFail() : "";
    //     }

    //     disableSpinningWheel();
    //   },
    // });
  }
}
function dataToDB(datas: Pick<SchoolType, "name" | "lon" | "lat">[]) {
  return datas.map((data) => {
    return SchoolEntity.dbFormat({
      name: data.name,
      lat: +data.lat,
      lon: +data.lon,
    });
  });
}

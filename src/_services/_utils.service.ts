import Papa from "papaparse";
import { useStateGui } from "../StateGui";
import { SchoolType } from "../_entities/school.entity";
import { addNewUserInformation, disableSpinningWheel } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum, NatureEnum } from "../type";
import {
  buildSchools,
  setSchools,
} from "../views/content/graphicage/component/organism/SchoolPoints";
import { SchoolService } from "./school.service";

const [, { getActiveMapId }] = useStateGui();

// TODO Need auth0 authentication
// TODO Refacto error management
export class ServiceUtils {
  static async generic(url: string, options = {}) {
    let response: Response;
    try {
      response = await fetch(url, options);
    } catch (error) {
      connexionError();
      return false;
    }

    if (!(await manageStatusCode(response))) return false;
    return await response.json();
  }

  static async get(url: string, urlNeedMap = true) {
    return await this.generic(this.buildXanoUrl(url, urlNeedMap));
  }

  static async post(url: string, data: object, urlNeedMap = true) {
    return await this.generic(this.buildXanoUrl(url, urlNeedMap), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  static async patch(url: string, data: object, urlNeedMap = true) {
    return await this.generic(this.buildXanoUrl(url, urlNeedMap), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  static async delete(url: string, urlNeedMap = true) {
    return await this.generic(this.buildXanoUrl(url, urlNeedMap), {
      method: "DELETE",
    });
  }

  static buildXanoUrl(url: string, urlNeedMap: boolean) {
    let buildUrl = import.meta.env.VITE_XANO_URL;
    if (urlNeedMap) {
      buildUrl += "/map/" + getActiveMapId();
    }
    return buildUrl + url;
  }

  static async parseFile(file: File): Promise<Papa.ParseResult<unknown>> {
    const res = new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete(results) {
          resolve(results);
        },
        error(err) {
          reject(err);
        },
      });
    });

    return res as Promise<Papa.ParseResult<unknown>>;
  }
  static fileNameIsCorrect(fileName: string) {
    const regexExtention = new RegExp(".csv$");
    if (!regexExtention.test(fileName)) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Fichier non reconnue. Veuillez utiliser des .csv lors de l'importation.",
      });
      return false;
    }

    const strReg =
      "[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2}_etablissement.csv";
    const regex = new RegExp(strReg);

    if (!regex.test(fileName)) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "Nom du fichier incorrect",
      });

      return false;
    }
    return true;
  }
  static isCorrectHeader(
    currentHeader: string[] | undefined,
    correctHeader: string[]
  ) {
    if (currentHeader?.toString() != correctHeader.toString()) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Erreur de formatage du header. \n Veuillez utiliser le header suivant: ['name', 'lat', 'lon']",
      });
      return false;
    }
    return true;
  }

  static async importEntities(
    file: File,
    onComplete: () => void,
    onFail: () => void,
    importType: NatureEnum
  ) {
    const fileName = file.name;

    if (!ServiceUtils.fileNameIsCorrect(fileName)) {
      disableSpinningWheel();
      onFail();
      return;
    }

    const parsedFile = await ServiceUtils.parseFile(file);

    const correctHeader = ["name", "lat", "lon"];
    if (!ServiceUtils.isCorrectHeader(parsedFile.meta.fields, correctHeader)) {
      disableSpinningWheel();
      onFail();
      return;
    }

    try {
      let data = [];
      if (importType === NatureEnum.school) {
        data = SchoolService.dataToDB(
          parsedFile.data.slice(0, parsedFile.data.length - 1) as Pick<
            SchoolType,
            "name" | "lon" | "lat"
          >[]
        ); // data.length - 1 to skip the last empty line of the csv

        const schools: SchoolType[] = buildSchools(
          await SchoolService.importSchools(data)
        );

        setSchools(schools);
        onComplete();
      } else {
        onFail();
      }
    } catch (err) {
      console.log("Import failed", err);
      onFail();
    }

    disableSpinningWheel();
  }
}

// TODO reformat this (copy/past from point.service.ts)
export const connexionError = () => {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.error,
    type: MessageTypeEnum.global,
    content: "Une erreur est survenue lors du chargement des données.",
  });
};

// TODO reformat this (copy/past from point.service.ts)
export const manageStatusCode = async (response: Response) => {
  const error: { message?: string } = {};

  switch (response.status) {
    case 429:
      const json = await response.json();

      error.message =
        json.detail ??
        "Trop de requêtes effectuer, veuillez essayer ultérieurement";
      break;
  }

  if (response.status !== 200) {
    const json = await response.json();
    const message =
      json.detail ?? "Une erreur est survenue lors du chargement des données.";

    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.error,
      type: MessageTypeEnum.global,
      content: error.message ?? message,
    });

    return false;
  }

  return true;
};

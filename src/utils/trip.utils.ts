import { LineType } from "../_entities/line.entity";
import { getLines } from "../views/content/map/component/organism/BusLines";

export namespace TripUtils {
  export function get(tripId: number) {
    return getLines()
      .flatMap((line) => line.trips)
      .filter((trip) => trip.id == tripId)[0];
  }

  export function getLine(tripId: number): LineType {
    return getLines().filter((line) =>
      line.trips.some((trip) => trip.id == tripId)
    )[0];
    
  export function convertSecondesToHourMinute(secondes: number): string {
    const heures: number = Math.floor(secondes / 3600);
    const minutes: number = Math.floor((secondes % 3600) / 60);

    const heuresStr: string = heures < 10 ? "0" + heures : heures.toString();
    const minutesStr: string =
      minutes < 10 ? "0" + minutes : minutes.toString();

    return `${heuresStr}:${minutesStr}`;
  }

  export function addHourTogether(heure1: string, heure2: string): string {
    const [heures1, minutes1] = heure1.split(":").map(Number);
    const [heures2, minutes2] = heure2.split(":").map(Number);

    let heuresTotales = heures1 + heures2;
    let minutesTotales = minutes1 + minutes2;

    // Gérer le cas où les minutes dépassent 60
    heuresTotales += Math.floor(minutesTotales / 60);
    minutesTotales = minutesTotales % 60;

    // Formater les heures et les minutes en chaînes de caractères avec des zéros ajoutés si nécessaire
    const heuresStr: string =
      heuresTotales < 10 ? "0" + heuresTotales : heuresTotales.toString();
    const minutesStr: string =
      minutesTotales < 10 ? "0" + minutesTotales : minutesTotales.toString();

    return `${heuresStr}:${minutesStr}`;
  }
}

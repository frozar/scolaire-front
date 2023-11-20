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
    const hour: number = Math.floor(secondes / 3600);
    const minutes: number = Math.floor((secondes % 3600) / 60);

    const hourStr: string = hour < 10 ? "0" + hour : hour.toString();
    const minutesStr: string =
      minutes < 10 ? "0" + minutes : minutes.toString();

    return `${hourStr}:${minutesStr}`;
  }

  export function addHourTogether(heure1: string, heure2: string): string {
    const [hour1, minutes1] = heure1.split(":").map(Number);
    const [hour2, minutes2] = heure2.split(":").map(Number);

    let totalHour = hour1 + hour2;
    let totalMinutes = minutes1 + minutes2;

    // Gérer le cas où les minutes dépassent 60
    totalHour += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    // Formater les heures et les minutes en chaînes de caractères avec des zéros ajoutés si nécessaire
    const hourStr: string =
      totalHour < 10 ? "0" + totalHour : totalHour.toString();
    const minutesStr: string =
      totalMinutes < 10 ? "0" + totalMinutes : totalMinutes.toString();

    return `${hourStr}:${minutesStr}`;
  }
}

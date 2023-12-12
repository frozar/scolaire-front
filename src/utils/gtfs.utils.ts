export namespace GtfsUtils {
  export function formatDate(date: Date): string {
    const day = date.getDate();
    const formatedDay =
      String(day).length == 1 ? "0" + String(day) : String(day);

    const month = date.getMonth() + 1;
    const formatedMonth =
      String(month).length == 1 ? "0" + String(month) : String(month);

    return String(date.getFullYear()) + formatedMonth + formatedDay;
  }

  export function addDays(date: Date, daysToAdd: number): string {
    // const day = date.getDate() + daysToAdd;
    // ! ICI en cours
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + daysToAdd
    );
    const formatedDay =
      String(day).length == 1 ? "0" + String(day) : String(day);

    const month = date.getMonth() + 1;
    const formatedMonth =
      String(month).length == 1 ? "0" + String(month) : String(month);

    return String(date.getFullYear()) + formatedMonth + formatedDay;
  }
}

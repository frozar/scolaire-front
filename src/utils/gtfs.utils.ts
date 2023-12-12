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
}

import { JSXElement, Show } from "solid-js";
import "./MapInformationPanel.css";
import { getSchools } from "./SchoolPoints";

export function MapInformationPanel(): JSXElement {
  // get schools that don't have calendar
  function schoolsWithoutCalendar() {
    return getSchools().filter((school) => !school.calendar);
  }
  return (
    <div id="map-information-panel">
      <div>Informations:</div>
      <Show when={schoolsWithoutCalendar().length > 0}>
        {/* Put definitive color chosen in tailwind config file */}
        <div class="text-orange-600">
          {schoolsWithoutCalendar().length + " écoles sans calendriers"}
        </div>
      </Show>
    </div>
  );
}

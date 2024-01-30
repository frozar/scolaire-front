import { JSXElement, Show } from "solid-js";
import { MapInformationPanelItem } from "../molecule/MapInformationPanelItem";
import "./MapInformationPanel.css";
import { getSchools } from "./SchoolPoints";

export function MapInformationPanel(): JSXElement {
  function schoolsWithoutCalendar() {
    return getSchools().filter((school) => !school.calendar);
  }

  function thereIsInformationToDisplay(): boolean {
    if (schoolsWithoutCalendar().length > 0) return true;
    return false;
  }

  return (
    <Show when={thereIsInformationToDisplay()}>
      <div id="map-information-panel">
        <Show when={schoolsWithoutCalendar().length > 0}>
          <MapInformationPanelItem
            schoolsToDisplay={schoolsWithoutCalendar()}
            titleText="écoles sans calendrier"
          />
        </Show>
      </div>
    </Show>
  );
}

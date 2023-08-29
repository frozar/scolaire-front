import { For, Show } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { updatePolylineWithOsrm } from "../../../../_entities/bus-line.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { LineUnderConstructionType } from "../../../../type";
import { setFilAriane } from "../../../layout/component/template/InformationBoardLayout";
import { ColorPicker } from "../component/atom/ColorPicker";
import { DrawHelperButton } from "../component/atom/DrawHelperButton";
import { TimelineAddPointButton } from "../component/atom/TimelineAddPointButton";
import TimelineItemAddMode from "../component/atom/TimelineItemAddMode";
import {
  displayLineMode,
  displayLineModeEnum,
  setDisplayLineMode,
} from "../component/organism/DrawModeBoardContent";
import "./TimelineAddMode.css";
import SchoolsEnumeration from "./components/molecul/SchoolsEnumeration";
const [, { isInAddLineMode, getLineUnderConstruction }] = useStateAction();

export default function (props: {
  //TODO pas utile de les passer en paramètre ce sont des signaux
  line: () => LineUnderConstructionType;
  setLine: (line: LineUnderConstructionType) => void;
  schools: SchoolType[];
}) {
  setFilAriane("Editer votre ligne");

  async function onClick() {
    if (displayLineMode() == displayLineModeEnum.straight) {
      if (getLineUnderConstruction().busLine.points.length < 2) {
        return;
      }
      await updatePolylineWithOsrm(getLineUnderConstruction().busLine);
      setDisplayLineMode(displayLineModeEnum.onRoad);
      // ! Changement de drawModeStep
    } else if (displayLineMode() == displayLineModeEnum.onRoad) {
      getLineUnderConstruction().busLine.setLatLngs([]);
      setDisplayLineMode(displayLineModeEnum.straight);
      // ! Changement de drawModeStep
    }
  }
  return (
    <section>
      {/* // TODO: externalise school list of current editing line */}
      <SchoolsEnumeration
        schoolsName={props.schools.map((school) => school.name)}
      />
      {/* <p>Ecoles</p>
      <p class="edit-mode-school-item">
        <For each={props.schools}>
          {(school) => {
            return <>{school.name}</>;
          }}
        </For>
      </p> */}

      {/* // TODO externalise labeled input field & link the input to the line name */}
      <div class="labeled-input-field">
        <label for="line-name">Nom de la ligne</label>
        <input
          class="labeled-input"
          type="text"
          placeholder="Entrer le nom de la ligne"
        />
      </div>

      <div class="flex mt-4 justify-between">
        <ColorPicker
          title="Couleur de la ligne"
          onInput={() => {
            console.log("ok");
          }} // TODO
          onChange={() => {
            console.log("ok");
          }} // TODO
        />

        {/* // TODO externalie svg & button */}
        <Show
          when={displayLineMode() == displayLineModeEnum.straight}
          fallback={
            <button onClick={onClick} class="btn-icon mr-2">
              <svg
                width="auto"
                height="auto"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 2.5L13.5 13.5M2 3C1.73478 3 1.48043 2.89464 1.29289 2.70711C1.10536 2.51957 1 2.26522 1 2C1 1.73478 1.10536 1.48043 1.29289 1.29289C1.48043 1.10536 1.73478 1 2 1C2.26522 1 2.51957 1.10536 2.70711 1.29289C2.89464 1.48043 3 1.73478 3 2C3 2.26522 2.89464 2.51957 2.70711 2.70711C2.51957 2.89464 2.26522 3 2 3ZM14 15C13.7348 15 13.4804 14.8946 13.2929 14.7071C13.1054 14.5196 13 14.2652 13 14C13 13.7348 13.1054 13.4804 13.2929 13.2929C13.4804 13.1054 13.7348 13 14 13C14.2652 13 14.5196 13.1054 14.7071 13.2929C14.8946 13.4804 15 13.7348 15 14C15 14.2652 14.8946 14.5196 14.7071 14.7071C14.5196 14.8946 14.2652 15 14 15Z"
                  stroke="#062F3F"
                />
              </svg>
            </button>
          }
        >
          <button onClick={onClick} class="btn-icon mr-2">
            <svg
              width="auto"
              height="auto"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 2C3 2.26522 2.89464 2.51957 2.70711 2.70711C2.51957 2.89464 2.26522 3 2 3C1.73478 3 1.48043 2.89464 1.29289 2.70711C1.10536 2.51957 1 2.26522 1 2C1 1.73478 1.10536 1.48043 1.29289 1.29289C1.48043 1.10536 1.73478 1 2 1C2.26522 1 2.51957 1.10536 2.70711 1.29289C2.89464 1.48043 3 1.73478 3 2ZM3 2H5C5.79565 2 6.55871 2.31607 7.12132 2.87868C7.68393 3.44129 8 4.20435 8 5V11C8 11.7956 8.31607 12.5587 8.87868 13.1213C9.44129 13.6839 10.2044 14 11 14H13M13 14C13 14.2652 13.1054 14.5196 13.2929 14.7071C13.4804 14.8946 13.7348 15 14 15C14.2652 15 14.5196 14.8946 14.7071 14.7071C14.8946 14.5196 15 14.2652 15 14C15 13.7348 14.8946 13.4804 14.7071 13.2929C14.5196 13.1054 14.2652 13 14 13C13.7348 13 13.4804 13.1054 13.2929 13.2929C13.1054 13.4804 13 13.7348 13 14Z"
                stroke="black"
              />
            </svg>
          </button>
        </Show>
      </div>

      <Show
        when={getLineUnderConstruction().busLine.points.length > 0}
        fallback={
          <div class="flex justify-center">
            Veuillez séléctionner des point sur la carte
          </div>
        }
      >
        <div class="timeline">
          <div class="timeline-tools">
            <Show when={props.line().busLine.points.length > 0}>
              <DrawHelperButton schools={props.line().busLine.schools} />
            </Show>
          </div>
          <div
            class="timeline-items v-timeline--side-end v-timeline--vertical"
            style={{ "--v-timeline-line-thickness": "2px" }}
          >
            <For each={props.line()?.busLine.points}>
              {(stop, i) => (
                <>
                  <TimelineAddPointButton indice={i()} />

                  <TimelineItemAddMode
                    pointsResource={stop}
                    indice={i()}
                    setter={props.setLine}
                    getter={props.line}
                    isInAddLineMode={isInAddLineMode()}
                  />
                </>
              )}
            </For>
          </div>
        </div>
      </Show>
    </section>
  );
}

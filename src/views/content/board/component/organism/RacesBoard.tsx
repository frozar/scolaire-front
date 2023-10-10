import { createSignal } from "solid-js";
import PlusIcon from "../../../../../icons/PlusIcon";
import { displayAddCourseMessage } from "../../../../../userInformation/utils";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import {
  deselectAllRaces,
  getRaces,
} from "../../../map/component/organism/Races";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import { RacesList } from "../../../schools/component/organism/RacesList";
import ButtonIcon from "../molecule/ButtonIcon";
import { onBoard, toggleDrawMod } from "../template/ContextManager";
import { DrawModeStep, setCurrentStep } from "./DrawModeBoardContent";
import "./RacesBoard.css";

export function RacesBoard() {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  const filteredCourses = () =>
    getRaces.filter((line) => line.name?.includes(searchKeyword()));

  function addCourse() {
    if (onBoard() == "course-draw") {
      toggleDrawMod();
      setCurrentStep(DrawModeStep.start);
    } else {
      deselectAllPoints();
      deselectAllRaces();
      toggleDrawMod();

      setCurrentStep(DrawModeStep.schoolSelection);
      displayAddCourseMessage();
    }
  }

  function onInputSearch(key: string) {
    setSearchKeyword(key);
  }

  return (
    <section>
      <header class="races-board-header">
        <div class="races-board-header-infos">
          <p>Total des courses: {getRaces.length}</p>
          <ButtonIcon icon={<PlusIcon />} onClick={addCourse} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>

      <RacesList races={filteredCourses()} />
    </section>
  );
}

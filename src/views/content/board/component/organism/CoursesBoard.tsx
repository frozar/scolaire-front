import { createSignal } from "solid-js";
import PlusIcon from "../../../../../icons/PlusIcon";
import { displayAddCourseMessage } from "../../../../../userInformation/utils";
import {
  deselectAllBusCourses,
  getBusCourses,
} from "../../../map/component/organism/BusCourses";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import CoursesList from "../../../schools/component/organism/CoursesList";
import ButtonIcon from "../molecule/ButtonIcon";
import { onBoard, toggleDrawMod } from "../template/ContextManager";
import "./CoursesBoard.css";
import { drawModeStep, setCurrentStep } from "./DrawModeBoardContent";

export default function () {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  const filteredCourses = () =>
    getBusCourses().filter((line) => line.name?.includes(searchKeyword()));

  function addCourse() {
    if (onBoard() == "line-draw") {
      toggleDrawMod();
      setCurrentStep(drawModeStep.start);
    } else {
      deselectAllPoints();
      deselectAllBusCourses();
      toggleDrawMod();

      setCurrentStep(drawModeStep.schoolSelection);
      displayAddCourseMessage();
    }
  }

  function onInputSearch(key: string) {
    setSearchKeyword(key);
  }

  return (
    <section>
      <header class="line-board-header">
        <div class="line-board-header-infos">
          <p>Total des lignes: {getBusCourses().length}</p>
          <ButtonIcon icon={<PlusIcon />} onClick={addCourse} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>

      <CoursesList lines={filteredCourses()} />
    </section>
  );
}

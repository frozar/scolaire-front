import { createSignal } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { displayAddCourseMessage } from "../../../../../userInformation/utils";
import { getSelectedLine } from "../../../map/component/organism/BusLines";
import {
  deselectAllCourses,
  getCourses,
} from "../../../map/component/organism/Courses";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import CoursesList from "../../../schools/component/organism/CoursesList";
import RemoveLineButton from "../atom/RemoveLineButton";
import UpdateLineButton from "../atom/UpdateLineButton";
import ButtonIcon from "../molecule/ButtonIcon";
import { onBoard, toggleDrawMod } from "../template/ContextManager";
import "./CoursesBoard.css";
import { drawModeStep, setCurrentStep } from "./DrawModeBoardContent";

export default function () {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  const filteredCourses = () =>
    getCourses().filter((course) => course.name?.includes(searchKeyword()));

  function addCourse() {
    if (onBoard() == "course-draw") {
      toggleDrawMod();
      setCurrentStep(drawModeStep.start);
    } else {
      deselectAllPoints();
      deselectAllCourses();
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
      <div class="bus-course-information-board-content-title">
        <div class="bus-course-information-board-content-name">
          {getSelectedLine()?.name}
        </div>
        <UpdateLineButton line={getSelectedLine() as LineType} />
        <RemoveLineButton line={getSelectedLine() as LineType} />
      </div>
      <header class="line-board-header">
        <div class="line-board-header-infos">
          <p>Total des courses: {getCourses().length}</p>
          <ButtonIcon icon={<PlusIcon />} onClick={addCourse} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>

      <CoursesList courses={filteredCourses()} />
    </section>
  );
}

import { GradeType } from "../../_entities/grade.entity";
import { SchoolType } from "../../_entities/school.entity";
import { StopType } from "../../_entities/stop.entity";
import { setSelectedMenu } from "../layout/menuItemFields";
import { setMapBoard } from "./_component/template/MapBoardManager";
import { changeBoard } from "./board/component/template/ContextManager";
import { setSchoolDetails } from "./schools/component/template/SchoolDetails";
import { setSchoolGradeDetails } from "./schools/component/template/SchoolGradeDetails";
import { setSchoolGradeEdit } from "./schools/component/template/SchoolGradeEdit";
import { setStopDetails } from "./stops/component/template/StopDetails";

// You have to set the MapBoard before the SelectMenu
export namespace ViewManager {
  export function dashboard() {
    setMapBoard("dashboard");
    setSelectedMenu("dashboard");
    //TODO to delete post refacto
    changeBoard(undefined);
  }

  export function stops() {
    setMapBoard("stops");
    setSelectedMenu("stops");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function stopDetails(stop: StopType) {
    setStopDetails(stop);
    setMapBoard("stop-details");
    setSelectedMenu("stops");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function schools() {
    setMapBoard("schools");
    setSelectedMenu("schools");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function schoolDetails(school: SchoolType) {
    setSchoolDetails(school);
    setMapBoard("school-details");
    setSelectedMenu("schools");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function schoolGrade(grade: GradeType) {
    setSchoolGradeDetails(grade);
    setMapBoard("school-grade-details");
    setSelectedMenu("schools");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function schoolGradeEdit(grade: GradeType) {
    console.log("schoolGradeEdit", grade);
    setSchoolGradeEdit(grade);
    setMapBoard("school-grade-edit");
    setSelectedMenu("schools");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
}

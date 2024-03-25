import { GradeType } from "../../_entities/grade.entity";
import { RoadType } from "../../_entities/road.entity";
import { SchoolType } from "../../_entities/school.entity";
import { StopType } from "../../_entities/stop.entity";
import { setSelectedMenu } from "../layout/menuItemFields";
import { setMapBoard } from "./_component/template/MapBoardManager";
import { changeBoard } from "./board/component/template/ContextManager";
import { setSelectedRoad } from "./paths/template/PathDetails";
import { setEditRoad } from "./paths/template/PathEdit";
import { setSchoolDetails } from "./schools/component/template/SchoolDetails";
import { setSchoolOfAddGrade } from "./schools/component/template/SchoolGradeAdd";
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

  export function paths() {
    setMapBoard("paths");
    setSelectedMenu("paths");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function pathAdd() {
    setMapBoard("path-add");
    setSelectedMenu("paths");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function pathDetails(road: RoadType) {
    setSelectedRoad(road);
    setMapBoard("path-details");
    setSelectedMenu("paths");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function pathEdit(road: RoadType) {
    setEditRoad(road);
    setMapBoard("path-edit");
    setSelectedMenu("paths");
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
    setSchoolGradeEdit(grade);
    setMapBoard("school-grade-edit");
    setSelectedMenu("schools");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function schoolGradeAdd(school: SchoolType) {
    setSchoolOfAddGrade(school);
    setMapBoard("school-grade-add");
    setSelectedMenu("schools");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
}

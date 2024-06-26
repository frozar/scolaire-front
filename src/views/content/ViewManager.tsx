import { GradeType } from "../../_entities/grade.entity";
import { LineType } from "../../_entities/line.entity";
import { OrganizationType } from "../../_entities/organization.entity";
import { PathType } from "../../_entities/road.entity";
import { SchoolType } from "../../_entities/school.entity";
import { StopType } from "../../_entities/stop.entity";
import { TripType } from "../../_entities/trip.entity";
import { setSelectedMenu } from "../layout/menuItemFields";
import { setMapBoard } from "./_component/template/MapBoardManager";
import { changeBoard } from "./board/component/template/ContextManager";
import { setSelectedLine } from "./line/template/LineDetails";
import { setEditLine } from "./line/template/LineEdit";
import { setDetailsOrganization } from "./organization/template/OrganizationDetails";
import { setEditOrganization } from "./organization/template/OrganizationEdit";
import { setSelectedRoad } from "./paths/template/PathDetails";
import { setEditRoad } from "./paths/template/PathEdit";
import { setSchoolDetails } from "./schools/component/template/SchoolDetails";
import { setSchoolOfAddGrade } from "./schools/component/template/SchoolGradeAdd";
import { setSchoolGradeDetails } from "./schools/component/template/SchoolGradeDetails";
import { setSchoolGradeEdit } from "./schools/component/template/SchoolGradeEdit";
import { setStopDetails } from "./stops/component/template/StopDetails";
import { setSelectedTripAddLine } from "./trips/template/TripAdd";
import { setSelectedTrip } from "./trips/template/TripDetails";
import { setSelectedEditTrip } from "./trips/template/TripEdit";

// You have to set the MapBoard before the SelectMenu
export namespace ViewManager {
  export function dashboard() {
    setMapBoard("dashboard");
    setSelectedMenu("dashboard");
    //TODO to delete post refacto
    changeBoard(undefined);
  }

  /**
   * Lines
   */
  export function lines() {
    setMapBoard("lines");
    //TODO change lines to graphicage post board refacto
    setSelectedMenu("lines");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function lineDetails(line: LineType) {
    setSelectedLine(line);
    setMapBoard("line-details");
    //TODO change lines to graphicage post board refacto
    setSelectedMenu("lines");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function lineAdd() {
    setMapBoard("line-add");
    //TODO change lines to graphicage post board refacto
    setSelectedMenu("lines");
    //TODO to delete post refacto
    changeBoard(undefined);
  }

  export function LineEdit(line: LineType) {
    setEditLine(line);
    setMapBoard("line-edit");
    //TODO change lines to graphicage post board refacto
    setSelectedMenu("lines");
    //TODO to delete post refacto
    changeBoard(undefined);
  }

  /**
   * Trips
   */
  export function tripDetails(trip: TripType) {
    setSelectedTrip(trip);
    setMapBoard("trip-details");
    //TODO change lines to graphicage post board refacto
    setSelectedMenu("lines");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function tripEdit(trip: TripType) {
    setSelectedEditTrip(trip);
    setMapBoard("trip-edit");
    //TODO change lines to graphicage post board refacto
    setSelectedMenu("lines");
    //TODO to delete post refacto
    changeBoard(undefined);
  }

  export function tripAdd(line: LineType) {
    setSelectedTripAddLine(line);
    setMapBoard("trip-add");
    //TODO change lines to graphicage post board refacto
    setSelectedMenu("lines");
    //TODO to delete post refacto
    changeBoard(undefined);
  }

  /**
   * Paths
   */
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
  export function pathDetails(road: PathType) {
    setSelectedRoad(road);
    setMapBoard("path-details");
    setSelectedMenu("paths");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  export function pathEdit(road: PathType) {
    setEditRoad(road);
    setMapBoard("path-edit");
    setSelectedMenu("paths");
    //TODO to delete post refacto
    changeBoard(undefined);
  }

  /**
   * Stops
   */
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
  export function stopAdd() {
    setMapBoard("stop-add");
    setSelectedMenu("stops");
    //TODO to delete post refacto
    changeBoard(undefined);
  }

  /**
   * Schools
   */
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
  export function schoolAdd() {
    setMapBoard("school-add");
    setSelectedMenu("schools");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
  /**
   * School Grades
   */
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

  /**
   * Organization
   */
  export function organizationUsers() {
    setSelectedMenu("organization-users");
    //TODO to delete post refacto
    changeBoard(undefined);
  }

  export function organizations() {
    setSelectedMenu("organizations");
    //TODO to delete post refacto
    changeBoard(undefined);
  }

  export function organizationAdd() {
    setSelectedMenu("organization-add");
    //TODO to delete post refacto
    changeBoard(undefined);
  }

  export function organizationDetails(org: OrganizationType) {
    setDetailsOrganization(org);
    setSelectedMenu("organization-details");
    //TODO to delete post refacto
    changeBoard(undefined);
  }

  export function organizationEdit(org: OrganizationType) {
    setEditOrganization(org);
    setSelectedMenu("organization-edit");
    //TODO to delete post refacto
    changeBoard(undefined);
  }
}

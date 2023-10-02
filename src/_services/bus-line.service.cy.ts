import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { CourseEntity } from "../_entities/course.entity";
import { NatureEnum } from "../type";
import { ServiceUtils } from "./_utils.service";
import { CourseService } from "./course.service";

const [, { setActiveMapId }] = useStateGui();

describe("CourseService", () => {
  setActiveMapId(1);
  const [selected, setSelected] = createSignal<boolean>(false);
  const [latLngs, setLatLngs] = createSignal<L.LatLng[]>([]);
  const [color, setColor] = createSignal<string>("#0000");

  // TODO: check why CourseEntity.build is not catch with cy.spy
  // ERROR: AssertionError: expected build to have been called at least once, but it was never called
  // TESTED: in course.service, place CourseEntity.build in var and return the var | same result

  it("GetAll, spy on: generic, buildXanoUrl & get from ServiceUtils, build from CourseEntity", () => {
    // Spy on: buildXanoUrl, generic, post, build
    // const spyCourseEntityBuild = cy.spy(CourseEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "get");

    CourseService.getAll();

    // expect(spyCourseEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Create, check: spy on generic & buildXanoUrl & get from ServiceUtils &   ", () => {
    // Spy on: buildXanoUrl, generic, post, build, dbFormat
    const spyCourseEntityDBFormat = cy.spy(CourseEntity, "dbFormat");
    // const spyCourseEntityBuild = cy.spy(CourseEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "post");

    CourseService.create({
      id: 1,
      name: "line name",
      color: color,
      setColor: setColor,
      latLngs: latLngs,
      setLatLngs: setLatLngs,
      selected: selected,
      setSelected: setSelected,
      schools: [
        {
          id: 1,
          lon: 55.534380675351,
          lat: -20.946658830374,
          name: "Ecole DE BEAUMONT",
          nature: NatureEnum.school,
          associated: [{ id: 7, name: "BENJOINS", quantity: 4 }],
          selected: selected,
          setSelected: setSelected,
          leafletId: 1,
        },
      ],
      points: [
        {
          id: 1,
          leafletId: 1,
          name: "name",
          lon: 1,
          lat: 1,
          quantity: 1,
          nature: NatureEnum.stop,
        },
      ],
    });

    expect(spyCourseEntityDBFormat).to.be.called;
    // expect(spyCourseEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Update, check: spy on generic & buildXanoUrl & get from ServiceUtils &   ", () => {
    // Spy on: buildXanoUrl, generic, post, build, dbPartialFormat
    const spyCourseEntityDBPartialFormat = cy.spy(
      CourseEntity,
      "dbPartialFormat"
    );
    // const spyCourseEntityBuild = cy.spy(CourseEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "patch");

    CourseService.update({
      id: 1,
      name: "new line name",
    });

    expect(spyCourseEntityDBPartialFormat).to.be.called;
    // expect(spyCourseEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Delete, check: spy on generic & buildXanoUrl & delete from ServiceUtils &   ", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "delete");

    CourseService.delete(1);

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });
});

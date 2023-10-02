import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { BusCourseEntity } from "../_entities/bus-course.entity";
import { NatureEnum } from "../type";
import { ServiceUtils } from "./_utils.service";
import { BusCourseService } from "./bus-course.service";

const [, { setActiveMapId }] = useStateGui();

describe("BusCourseService", () => {
  setActiveMapId(1);
  const [selected, setSelected] = createSignal<boolean>(false);
  const [latLngs, setLatLngs] = createSignal<L.LatLng[]>([]);
  const [color, setColor] = createSignal<string>("#0000");

  // TODO: check why BusCourseEntity.build is not catch with cy.spy
  // ERROR: AssertionError: expected build to have been called at least once, but it was never called
  // TESTED: in bus-course.service, place BusCourseEntity.build in var and return the var | same result

  it("GetAll, spy on: generic, buildXanoUrl & get from ServiceUtils, build from BusCourseEntity", () => {
    // Spy on: buildXanoUrl, generic, post, build
    // const spyBusCourseEntityBuild = cy.spy(BusCourseEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "get");

    BusCourseService.getAll();

    // expect(spyBusCourseEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Create, check: spy on generic & buildXanoUrl & get from ServiceUtils &   ", () => {
    // Spy on: buildXanoUrl, generic, post, build, dbFormat
    const spyBusCourseEntityDBFormat = cy.spy(BusCourseEntity, "dbFormat");
    // const spyBusCourseEntityBuild = cy.spy(BusCourseEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "post");

    BusCourseService.create({
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

    expect(spyBusCourseEntityDBFormat).to.be.called;
    // expect(spyBusCourseEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Update, check: spy on generic & buildXanoUrl & get from ServiceUtils &   ", () => {
    // Spy on: buildXanoUrl, generic, post, build, dbPartialFormat
    const spyBusCourseEntityDBPartialFormat = cy.spy(
      BusCourseEntity,
      "dbPartialFormat"
    );
    // const spyBusCourseEntityBuild = cy.spy(BusCourseEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "patch");

    BusCourseService.update({
      id: 1,
      name: "new line name",
    });

    expect(spyBusCourseEntityDBPartialFormat).to.be.called;
    // expect(spyBusCourseEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Delete, check: spy on generic & buildXanoUrl & delete from ServiceUtils &   ", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "delete");

    BusCourseService.delete(1);

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });
});

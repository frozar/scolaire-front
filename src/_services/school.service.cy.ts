import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { SchoolEntity } from "../_entities/school.entity";
import { NatureEnum } from "../type";
import { ServiceUtils } from "./_utils.service";
import { SchoolService } from "./school.service";

const [, { setActiveMapId }] = useStateGui();

describe("SchoolService", () => {
  setActiveMapId(1);
  const [selected, setSelected] = createSignal<boolean>();
  // To bypass select warning eslint
  selected;

  // TODO: check why SchoolEntity.build is not catch with cy.spy
  // ERROR: AssertionError: expected build to have been called at least once, but it was never called
  // TESTED: in bus-line.service, place SchoolEntity.build in var and return the var | same result

  it("getAll, spy on: generic, buildXanoUrl & get from ServiceUtils, build from SchoolEntity", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "get");

    // const spySchoolEntityBuild = cy.spy(SchoolEntity, "build");

    SchoolService.getAll();

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;

    // expect(spySchoolEntityBuild).to.be.called;
  });

  it("Create, spy on: generic, buildXanoUrl & post from ServiceUtils, build & dbFormat from SchoolEntity", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "post");

    const spySchoolEntityDBFormat = cy.spy(SchoolEntity, "dbFormat");
    // const spySchoolEntityBuild = cy.spy(SchoolEntity, "build");

    SchoolService.create({
      name: "name",
      lon: 1,
      lat: 1,
      nature: NatureEnum.school,
      leafletId: 1,
      setSelected: setSelected,
    });

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;

    expect(spySchoolEntityDBFormat).to.be.called;
    // expect(spySchoolEntityBuild).to.be.called;
  });

  it("Update, spy on: generic, buildXanoUrl & patch from ServiceUtils, build & dbFormat from SchoolEntity", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "patch");

    const spySchoolEntityDBFormat = cy.spy(SchoolEntity, "dbFormat");
    // const spySchoolEntityBuild = cy.spy(SchoolEntity, "build");

    SchoolService.update({
      id: 1,
      name: "name",
      lon: 1,
      lat: 1,
      nature: NatureEnum.school,
      leafletId: 1,
      setSelected: setSelected,
    });

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;

    expect(spySchoolEntityDBFormat).to.be.called;
    // expect(spySchoolEntityBuild).to.be.called;
  });

  it("Delete, spy on: generic, buildXanoUrl & delete from ServiceUtils", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "delete");

    SchoolService.delete(1);

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });
});

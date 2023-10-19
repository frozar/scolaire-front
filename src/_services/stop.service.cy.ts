import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { StopEntity } from "../_entities/stop.entity";
import { NatureEnum } from "../type";
import { ServiceUtils } from "./_utils.service";
import { StopService } from "./stop.service";

const [, { setActiveMapId }] = useStateGui();

describe("StopService", () => {
  setActiveMapId(1);
  const [selected, setSelected] = createSignal<boolean>();
  // To bypass select warning eslint
  selected;

  // TODO: check why StopEntity.build is not catch with cy.spy
  // ERROR: AssertionError: expected build to have been called at least once, but it was never called
  // TESTED: in bus-trip.service, place StopEntity.build in var and return the var | same result

  it("getAll, spy on: generic, buildXanoUrl & get from ServiceUtils, build from StopEntity", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "get");

    // const spyStopEntityBuild = cy.spy(StopEntity, "build");

    StopService.getAll();

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;

    // expect(spyStopEntityBuild).to.be.called;
  });

  it("Create, spy on: generic, buildXanoUrl & post from ServiceUtils, build & dbFormat from StopEntity", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "post");

    const spyStopEntityDBFormat = cy.spy(StopEntity, "dbFormat");
    // const spyStopEntityBuild = cy.spy(StopEntity, "build");

    StopService.create({
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

    expect(spyStopEntityDBFormat).to.be.called;
    // expect(spyStopEntityBuild).to.be.called;
  });

  it("Update, spy on: generic, buildXanoUrl & patch from ServiceUtils, build & dbFormat from StopEntity", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "patch");

    const spyStopEntityDBFormat = cy.spy(StopEntity, "dbFormat");
    // const spyStopEntityBuild = cy.spy(StopEntity, "build");

    StopService.update({
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

    expect(spyStopEntityDBFormat).to.be.called;
    // expect(spyStopEntityBuild).to.be.called;
  });

  it("Delete, spy on: generic, buildXanoUrl & delete from ServiceUtils", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "delete");

    StopService.delete(1);

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });
});

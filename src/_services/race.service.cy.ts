import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { RaceEntity } from "../_entities/race.entity";
import { NatureEnum } from "../type";
import { ServiceUtils } from "./_utils.service";
import { RaceService } from "./race.service";

const [, { setActiveMapId }] = useStateGui();

describe("RaceService", () => {
  setActiveMapId(1);
  const selected = false;

  const [schoolSelected, setSelected] = createSignal<boolean>(false);
  const latLngs: L.LatLng[] = [];
  const color = "#0000";

  // TODO: check why RaceEntity.build is not catch with cy.spy
  // ERROR: AssertionError: expected build to have been called at least once, but it was never called
  // TESTED: in bus-course.service, place RaceEntity.build in var and return the var | same result

  it("GetAll, spy on: generic, buildXanoUrl & get from ServiceUtils, build from RaceEntity", () => {
    // Spy on: buildXanoUrl, generic, post, build
    // const spyRaceEntityBuild = cy.spy(RaceEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "get");

    RaceService.getAll();

    // expect(spyRaceEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Create, check: spy on generic & buildXanoUrl & get from ServiceUtils &   ", () => {
    // Spy on: buildXanoUrl, generic, post, build, dbFormat
    const spyRaceEntityDBFormat = cy.spy(RaceEntity, "dbFormat");
    // const spyRaceEntityBuild = cy.spy(RaceEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "post");

    RaceService.create({
      id: 1,
      name: "line name",
      color: color,
      latLngs: latLngs,
      selected: selected,
      schools: [
        {
          id: 1,
          lon: 55.534380675351,
          lat: -20.946658830374,
          name: "Ecole DE BEAUMONT",
          nature: NatureEnum.school,
          // TODO add classes in test
          classes: [],
          associated: [
            {
              idClassToSchool: 7,
              name: "BENJOINS",
              quantity: 4,
              usedQuantity: 0,
            },
          ],
          selected: schoolSelected,
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

    expect(spyRaceEntityDBFormat).to.be.called;
    // expect(spyRaceEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Update, check: spy on generic & buildXanoUrl & get from ServiceUtils &   ", () => {
    // Spy on: buildXanoUrl, generic, post, build, dbPartialFormat
    const spyRaceEntityDBPartialFormat = cy.spy(RaceEntity, "dbPartialFormat");
    // const spyRaceEntityBuild = cy.spy(RaceEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "patch");

    RaceService.update({
      id: 1,
      name: "new line name",
    });

    expect(spyRaceEntityDBPartialFormat).to.be.called;
    // expect(spyRaceEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Delete, check: spy on generic & buildXanoUrl & delete from ServiceUtils &   ", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "delete");

    RaceService.delete(1);

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });
});

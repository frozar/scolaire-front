import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { TripEntity } from "../_entities/trip.entity";
import { NatureEnum } from "../type";
import { ServiceUtils } from "./_utils.service";
import { TripService } from "./trip.service";

const [, { setActiveMapId }] = useStateGui();

describe("TripService", () => {
  setActiveMapId(1);
  const selected = false;

  const [schoolSelected, setSelected] = createSignal<boolean>(false);
  const latLngs: L.LatLng[] = [];
  const color = "#0000";

  // TODO: check why TripEntity.build is not catch with cy.spy
  // ERROR: AssertionError: expected build to have been called at least once, but it was never called
  // TESTED: in bus-trip.service, place TripEntity.build in var and return the var | same result

  it("Create, check: spy on generic & buildXanoUrl & get from ServiceUtils &   ", () => {
    // Spy on: buildXanoUrl, generic, post, build, dbFormat
    const spyTripEntityDBFormat = cy.spy(TripEntity, "dbFormat");
    // const spyTripEntityBuild = cy.spy(TripEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "post");

    TripService.create({
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
          // TODO add grades in test
          grades: [],
          associated: [
            {
              idClassToSchool: 7,
              name: "BENJOINS",
              quantity: 4,
              // usedQuantity: 0,
            },
          ],
          selected: schoolSelected,
          setSelected: setSelected,
          leafletId: 1,
        },
      ],
      tripPoints: [
        {
          id: 1,
          leafletId: 1,
          name: "name",
          lon: 1,
          lat: 1,
          nature: NatureEnum.stop,
        },
      ],
    });

    expect(spyTripEntityDBFormat).to.be.called;
    // expect(spyTripEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Update, check: spy on generic & buildXanoUrl & get from ServiceUtils &   ", () => {
    // Spy on: buildXanoUrl, generic, post, build, dbPartialFormat
    const spyTripEntityDBPartialFormat = cy.spy(TripEntity, "dbPartialFormat");
    // const spyTripEntityBuild = cy.spy(TripEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "patch");

    TripService.update({
      id: 1,
      name: "new line name",
    });

    expect(spyTripEntityDBPartialFormat).to.be.called;
    // expect(spyTripEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Delete, check: spy on generic & buildXanoUrl & delete from ServiceUtils &   ", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "delete");

    TripService.delete(1);

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });
});

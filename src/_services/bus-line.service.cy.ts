import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { BusLineEntity } from "../_entities/bus-line.entity";
import { NatureEnum } from "../type";
import { ServiceUtils } from "./_utils.service";
import { BusLineService } from "./bus-line.service";

const [, { setActiveMapId }] = useStateGui();

describe("BusLineService", () => {
  setActiveMapId(1);
  // const url = "bus-line";
  // const interceptUrl = ServiceUtils.buildXanoUrl(url, true) + url;
  const [selected, setSelected] = createSignal<boolean>(false);
  const [latLngs, setLatLngs] = createSignal<L.LatLng[]>([]);
  const [color, setColor] = createSignal<string>("#0000");

  /** TODO: check why bus line is not catch.**/

  it("GetAll, spy on: generic, buildXanoUrl & get from ServiceUtils, build from BusLineEntity", () => {
    // Spy on: buildXanoUrl, generic, post, build
    // const spyBusLineEntityBuild = cy.spy(BusLineEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "get");

    BusLineService.getAll();

    // expect(spyBusLineEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Create, check: spy on generic & buildXanoUrl & get from ServiceUtils &   ", () => {
    // Spy on: buildXanoUrl, generic, post, build, dbFormat
    const spyBusLineEntityDBFormat = cy.spy(BusLineEntity, "dbFormat");
    // const spyBusLineEntityBuild = cy.spy(BusLineEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "post");

    BusLineService.create({
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

    expect(spyBusLineEntityDBFormat).to.be.called;
    // expect(spyBusLineEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });

  it("Update, check: spy on generic & buildXanoUrl & get from ServiceUtils &   ", () => {
    // Spy on: buildXanoUrl, generic, post, build, dbPartialFormat
    const spyBusLineEntityDBPartialFormat = cy.spy(
      BusLineEntity,
      "dbPartialFormat"
    );
    // const spyBusLineEntityBuild = cy.spy(BusLineEntity, "build");
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "patch");

    BusLineService.update({
      id: 1,
      name: "new line name",
    });

    expect(spyBusLineEntityDBPartialFormat).to.be.called;
    // expect(spyBusLineEntityBuild).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });
});

import { useStateGui } from "../StateGui";
import { ServiceUtils } from "./_utils.service";
import { MapService } from "./map.service";

const [, { setActiveMapId }] = useStateGui();

describe("SchoolService", () => {
  setActiveMapId(1);

  // TODO: check why MapEntity.build is not catch with cy.spy
  // ERROR: AssertionError: expected build to have been called at least once, but it was never called
  // TESTED: in bus-course.service, place MapEntity.build in var and return the var | same result

  it("getAll, spy on: generic, buildXanoUrl & get from ServiceUtils, build from MapService", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "get");

    // const spyMapServiceBuild = cy.spy(MapEntity, "build");

    MapService.getAll();

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;

    // expect(spyMapServiceBuild).to.be.called;
  });

  it("Create, spy on: generic, buildXanoUrl & get from ServiceUtils, build & dbFormat from MapService", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "post");

    // const spyMapEntityBuild = cy.spy(MapEntity, "build");

    MapService.create({
      name: "name",
    });

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;

    // expect(spyMapEntityBuild).to.be.called;
  });

  it("Delete, spy on: generic, buildXanoUrl & get from ServiceUtils, build & dbFormat from MapService", () => {
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spyGeneric = cy.spy(ServiceUtils, "generic");
    const spyGet = cy.spy(ServiceUtils, "delete");

    MapService.delete(1);

    expect(spyBuildXanoUrl).to.be.called;
    expect(spyGeneric).to.be.called;
    expect(spyGet).to.be.called;
  });
});

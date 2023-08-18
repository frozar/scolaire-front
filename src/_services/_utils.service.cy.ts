import { useStateGui } from "../StateGui";
import { ServiceUtils } from "./_utils.service";
const [, { setActiveMapId }] = useStateGui();

describe("ServiceUtils", () => {
  setActiveMapId(1);
  const url = "/";
  const interceptUrl = ServiceUtils.buildXanoUrl(url, true);
  const requestData = {
    data: "request data",
  };

  const checkResponseBody = (expected: object, actual: object) => {
    return JSON.stringify(expected) == JSON.stringify(actual);
  };

  it("Generic, check:  method,  url, response(status code, returned data)", () => {
    cy.intercept("GET", interceptUrl, requestData).as("getData");

    ServiceUtils.generic(interceptUrl, {
      method: "GET",
    });

    // Request check
    cy.wait("@getData").then((interception) => {
      cy.task("log", interception.response);
      expect(interception.request.method).to.eq("GET");
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.url).to.eq(interceptUrl);
    });
  });

  it("Post, check: spy on generic & buildXanoUrl , method,  url, response(status code, returned data)", () => {
    cy.intercept("POST", interceptUrl, requestData).as("getData");

    // Spy on: buildXanoUrl & generic
    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spy = cy.spy(ServiceUtils, "generic");

    ServiceUtils.post(url, requestData);

    cy.wait("@getData").then((interception) => {
      expect(interception.request.method).to.eq("POST");
      expect(interception.response?.statusCode).to.eq(200);
      expect(checkResponseBody(interception.response?.body, requestData)).to.eq(
        true
      );
      expect(interception.request.url).to.eq(interceptUrl);
    });

    // Check spies
    expect(spy).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
  });

  it("Patch, check: spy call on generic, method,  url, response(status code, returned data)", () => {
    cy.intercept("PATCH", interceptUrl, requestData).as("getData");

    const spyBuildXanoUrl = cy.spy(ServiceUtils, "buildXanoUrl");
    const spy = cy.spy(ServiceUtils, "generic");

    ServiceUtils.patch(url, requestData);
    cy.wait("@getData").then((interception) => {
      expect(interception.request.method).to.eq("PATCH");
      expect(interception.response?.statusCode).to.eq(200);
      expect(checkResponseBody(interception.response?.body, requestData)).to.eq(
        true
      );
      expect(interception.request.url).to.eq(interceptUrl);
    });
    expect(spy).to.be.called;
    expect(spyBuildXanoUrl).to.be.called;
  });

  // it("Delete, check: spy call on generic, method,  url, response(status code, returned data)", () => {
  //   cy.intercept("DELETE", url).as("getData");

  //   // Check call of generic method
  //   const spy = cy.spy(ServiceUtils, "generic").as("genericApiService");

  //   ServiceUtils.delete(url).then((response) => {
  //     cy.task("log", response);

  //     cy.wait("@getData").then((interception) => {
  //       expect(interception.request.method).to.eq("DELETE");
  //       expect(interception.response?.statusCode).to.eq(200);
  //       expect(interception.response?.body).to.have.eq(postData);
  //       expect(interception.request.url).to.eq(url);
  //     });
  //   });
  //   expect(spy).to.be.called;
  // });
});

import { ServiceUtils } from "./_utils.service";

describe("ServiceUtils", () => {
  const url = import.meta.env.VITE_BACK_URL + "/";

  const postData = {
    test: "test",
  };

  it("Generic, check:  method,  url, response(status code, returned data)", () => {
    cy.intercept("GET", url, {
      test: "test",
    }).as("getData");

    ServiceUtils.generic(url);

    // Request check
    cy.wait("@getData").then((interception) => {
      cy.task("log", interception.response);
      expect(interception.request.method).to.eq("GET");
      expect(interception.response?.statusCode).to.eq(200);
      // expect(interception.response?.body).to.eq;
      expect(interception.request.url).to.eq(url);
    });
  });

  it("Post, check: spy call on generic, method,  url, response(status code, returned data)", () => {
    cy.intercept("POST", url, postData).as("getData");

    // Check call of generic method
    const spy = cy.spy(ServiceUtils, "post").as("genericApiService");
    ServiceUtils.post(url, postData).then((response) => {
      cy.task("log", response);

      cy.wait("@getData").then((interception) => {
        cy.task("log", interception.response);
        expect(interception.request.method).to.eq("POST");
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body).to.have.eq(postData);
        expect(interception.request.url).to.eq(url);
      });
    });
    expect(spy).to.be.called;
  });

  it("Patch, check: spy call on generic, method,  url, response(status code, returned data)", () => {
    cy.intercept("POST", url, postData).as("getData");

    // Check call of generic method
    const spy = cy.spy(ServiceUtils, "generic").as("genericApiService");

    ServiceUtils.post(url, postData).then((response) => {
      cy.task("log", response);

      cy.wait("@getData").then((interception) => {
        expect(interception.request.method).to.eq("PATCH");
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body).to.have.eq(postData);
        expect(interception.request.url).to.eq(url);
      });
    });
    expect(spy).to.be.called;
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

/* eslint-disable @typescript-eslint/ban-ts-comment */
import PageTitle from "./PageTitle";

describe("LeftMenuItemLabel component", () => {
  it("PageTitle check style", () => {
    cy.mount(() => <PageTitle title="Title" />);

    cy.get(".page-title").contains("Title");

    cy.get(".page-title").compareSnapshot("primary-enabled", 0.01);
  });
});

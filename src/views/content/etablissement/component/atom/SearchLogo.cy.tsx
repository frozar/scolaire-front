/* eslint-disable @typescript-eslint/ban-ts-comment */
import SearchLogo from "./SearchLogo";

describe("SearchLogo ", () => {
  it("SearchLogo  snapshot", () => {
    cy.mount(() => <SearchLogo />);

    cy.get(".input-search-logo").then((input) => {
      cy.wrap(input).invoke("css", "height", "30px");
      cy.wrap(input).invoke("css", "width", "40px");
    });
    //@ts-ignore
    cy.get(".input-search-logo").compareSnapshot("logo", 0.01);
  });
});

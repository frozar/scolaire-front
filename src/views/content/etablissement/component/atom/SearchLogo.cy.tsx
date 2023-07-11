/* eslint-disable @typescript-eslint/ban-ts-comment */
import SearchLogo from "./SearchLogo";

describe("SearchLogo ", () => {
  it("SearchLogo  snapshot", () => {
    cy.mount(() => <SearchLogo />);

    //@ts-ignore
    cy.get(".input-search-logo").compareSnapshot("logo", 0.01);
  });
});

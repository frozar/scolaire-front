import SettingsIcon from "./SettingsIcon";

describe("SeetingsIcon atom", () => {
  it("Check Snapshot", () => {
    cy.mount(() => <SettingsIcon />);
    // TODO Cypresse don't produce snapshot
    cy.get("svg").compareSnapshot("toto", 0.01);
  });
});

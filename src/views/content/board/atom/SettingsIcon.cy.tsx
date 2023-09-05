import SettingsIcon from "./SettingsIcon";

describe("SeetingsIcon atom", () => {
  it("Check Snapshot", () => {
    cy.mount(() => <SettingsIcon />);
    cy.get("svg").compareSnapshot("good", 0.01);
  });
});

import { SettingsContentAnimationParameters } from "./SettingsContentAnimationParameters";

describe("SettingsContentAnimationParameters atom", () => {


    //TODO Have to Mock or Stub Signal

  it("selected checkbox", () => {
    cy.mount(() => (
      <SettingsContentAnimationParameters />
    ));
    cy.get(".settings-content-animation-parameter").compareSnapshot("selected", 0.01);
  });

  it("unselect checkbox", () => {
    cy.mount(() => (
      <SettingsContentAnimationParameters />
    ));
    cy.get(".settings-content-animation-parameter input")
      .then((input) => {
        cy.wrap(input).invoke("css", "outline", "none");
      });

    cy.get(".settings-content-animation-parameter input").click();
    cy.get(".settings-content-animation-parameter").compareSnapshot("nominal", 0.01);
  });
});

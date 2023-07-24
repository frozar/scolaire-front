import { SettingsContentAnimationParameters } from "./SettingsContentAnimationParameters";

describe("SettingsContentAnimationParameters atom", () => {


    //TODO ajouter un spy et un mock sur animation settings (stateAction)

  it("unselected checkbox", () => {
    cy.mount(() => (
      <SettingsContentAnimationParameters />
    ));
    cy.get(".settings-content-animation-parameter").compareSnapshot("nominal", 0.01);
  });

  it("select checkbox", () => {
    cy.mount(() => (
      <SettingsContentAnimationParameters />
    ));
    cy.get(".settings-content-animation-parameter input")
      .then((input) => {
        cy.wrap(input).invoke("css", "outline", "none");
      });

    cy.get(".settings-content-animation-parameter input").click();
    cy.get(".settings-content-animation-parameter").compareSnapshot("selected", 0.01);
  });
});

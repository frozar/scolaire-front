import { createSignal } from "solid-js";
import LeftNav from "./LeftNav";

/* eslint-disable @typescript-eslint/ban-ts-comment */

describe("LeftNav component", () => {
  const [displayMenu, setDisplayMenu] = createSignal(false);

  const props = {
    getDisplayedLeftMenu: displayMenu,
    toggleDisplayedLeftMenu: () => setDisplayMenu((bool) => !bool),
  };

  it("LeftNav check snapshot when nav is closed", () => {
    cy.mount(() => (
      <LeftNav
        getDisplayedLeftMenu={props.getDisplayedLeftMenu}
        toggleDisplayedLeftMenu={props.toggleDisplayedLeftMenu}
      />
    ));

    cy.get("#left-nav").then((component) => {
      cy.wrap(component).invoke("css", "height", "700px");
    });

    //@ts-ignore
    cy.get("#left-nav").compareSnapshot("LeftNav-closed", 0.01);
  });

  it("LeftNav check snapshot when nav is open", () => {
    cy.mount(() => (
      <LeftNav
        getDisplayedLeftMenu={() => !props.getDisplayedLeftMenu()}
        toggleDisplayedLeftMenu={props.toggleDisplayedLeftMenu}
      />
    ));

    cy.get("#left-nav").then((component) => {
      cy.wrap(component).invoke("css", "height", "700px");
    });

    cy.wait(500);

    //@ts-ignore
    cy.get("#left-nav").compareSnapshot("LeftNav-open", 0.01);
  });

  it("LeftNav checking toggle working", () => {
    cy.mount(() => (
      <LeftNav
        getDisplayedLeftMenu={props.getDisplayedLeftMenu}
        toggleDisplayedLeftMenu={props.toggleDisplayedLeftMenu}
      />
    ));

    cy.get("#left-nav").then((component) => {
      cy.wrap(component).invoke("css", "height", "700px");
    });

    cy.get("#left-close").then((component) => {
      cy.wrap(component).invoke("css", "outline", "none");
    });

    //@ts-ignore
    cy.get("#left-nav").compareSnapshot("LeftNav-closed", 0.01);

    cy.get("#left-close").click();
    cy.wait(400);

    //@ts-ignore
    cy.get("#left-nav").compareSnapshot("LeftNav-open", 0.01);

    cy.get("#left-close").click();
    cy.wait(400);

    //@ts-ignore
    cy.get("#left-nav").compareSnapshot("LeftNav-closed", 0.01);
  });
});

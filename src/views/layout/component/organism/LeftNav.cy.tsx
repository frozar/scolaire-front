import { createSignal } from "solid-js";
import LeftNav from "./LeftNav";

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

    cy.get("#lateral-nav").then((component) => {
      cy.wrap(component).invoke("css", "height", "700px");
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#lateral-nav").compareSnapshot("LeftNav-closed", 0.01);
  });

  it("LeftNav check snapshot when nav is open", () => {
    cy.mount(() => (
      <LeftNav
        getDisplayedLeftMenu={() => !props.getDisplayedLeftMenu()}
        toggleDisplayedLeftMenu={props.toggleDisplayedLeftMenu}
      />
    ));

    cy.get("#lateral-nav").then((component) => {
      cy.wrap(component).invoke("css", "height", "700px");
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#lateral-nav").compareSnapshot("LeftNav-open", 0.01);
  });

  it("LeftNav checking toggle working", () => {
    cy.mount(() => (
      <LeftNav
        getDisplayedLeftMenu={props.getDisplayedLeftMenu}
        toggleDisplayedLeftMenu={props.toggleDisplayedLeftMenu}
      />
    ));

    cy.get("#lateral-nav").then((component) => {
      cy.wrap(component).invoke("css", "height", "700px");
    });

    cy.get("#lateral-close").then((component) => {
      cy.wrap(component).invoke("css", "outline", "none");
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#lateral-nav").compareSnapshot("LeftNav-closed", 0.01);

    cy.get("#lateral-close").click();
    cy.wait(400);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#lateral-nav").compareSnapshot("LeftNav-open", 0.01);

    cy.get("#lateral-close").click();
    cy.wait(400);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#lateral-nav").compareSnapshot("LeftNav-closed", 0.01);
  });
});

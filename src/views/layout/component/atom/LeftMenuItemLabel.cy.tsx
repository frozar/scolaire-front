import LeftMenuItemLabel from "./LeftMenuItemLabel";

/* eslint-disable @typescript-eslint/ban-ts-comment */

describe("LeftMenuItemLabel component", () => {
  const props = {
    isActive: true,
    isDisabled: true,
    label: "Graphicage",
  };

  it("Check snapshot", () => {
    cy.mount(() => (
      <div id="left-nav" class="active">
        <LeftMenuItemLabel
          isActive={props.isActive}
          isDisabled={props.isDisabled}
          label={props.label}
        />
      </div>
    ));

    cy.get("span").then((span) => {
      cy.wrap(span).invoke("css", "background-color", "black");
    });

    cy.get("span").compareSnapshot("label", 0.01);
    cy.get("span").contains(props.label);
  });

  it("Check snapshot text active", () => {
    cy.mount(() => (
      <div id="left-nav" class="active">
        <LeftMenuItemLabel
          isActive={true}
          isDisabled={false}
          label={props.label}
        />
      </div>
    ));

    cy.get("span").compareSnapshot("label-active", 0.01);
    cy.get("span").contains(props.label);
  });

  it("When disabled", () => {
    cy.mount(() => (
      <div id="left-nav" class="active">
        <LeftMenuItemLabel
          isActive={!props.isActive}
          isDisabled={props.isDisabled}
          label={props.label}
        />
      </div>
    ));

    cy.get("span").then((span) => {
      cy.wrap(span).invoke("css", "background-color", "black");
    });

    cy.get("span").contains(props.label);
    cy.get("span").compareSnapshot("disabled", 0.01);
  });

  it("Check snapshot hidden", () => {
    cy.mount(() => (
      <div id="left-nav">
        <LeftMenuItemLabel
          isActive={!props.isActive}
          isDisabled={!props.isDisabled}
          label={props.label}
        />
      </div>
    ));

    cy.get("span").then((span) => {
      cy.wrap(span).invoke("css", "background-color", "black");
    });
    cy.get("span").compareSnapshot("label-hidden", 0.01);
  });
});

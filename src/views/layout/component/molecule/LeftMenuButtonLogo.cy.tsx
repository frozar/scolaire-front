import ArretsLogo from "../../../../icons/ArretsLogo";
import DashboardLogo from "../atom/DashboardLogo";
import EtablissementLogo from "../atom/EtablissementLogo";
import GraphicageLogo from "../atom/GraphicageLogo";
import RoadwaysLogo from "../atom/RoadwaysLogo";
import SettingsLogo from "../atom/SettingsLogo";
import SupportLogo from "../atom/SupportLogo";

import LeftMenuButtonLogo from "./LeftMenuButtonLogo";

describe("LeftMenuButtonLogo component", () => {
  const props = {
    isActive: false,
    isDisabled: false,
    children: <div>Logo content</div>,
  };

  it("LeftMenuButtonLogo check props working", () => {
    cy.mount(() => (
      <LeftMenuButtonLogo
        isActive={!props.isActive}
        isDisabled={props.isDisabled}
        children={props.children}
      />
    ));

    cy.get(".left-menu-button-logo")
      .should("have.class", "active")
      .should("not.have.class", "disabled")
      .get("div")
      .contains("Logo content");
  });

  it("LeftMenuButtonLogo check logo dashboard", () => {
    props.children = <DashboardLogo />;

    cy.mount(() => (
      <LeftMenuButtonLogo
        isActive={props.isActive}
        isDisabled={props.isDisabled}
        children={props.children}
      />
    ));

    cy.get("svg").should("be.visible");
    cy.get("span").compareSnapshot("logo-dashboard", 0.01);
  });

  it("LeftMenuButtonLogo check logo graphicage", () => {
    props.children = <GraphicageLogo />;

    cy.mount(() => (
      <LeftMenuButtonLogo
        isActive={props.isActive}
        isDisabled={props.isDisabled}
        children={props.children}
      />
    ));

    cy.get("svg").should("be.visible");
    cy.get("span").compareSnapshot("logo-graphicage", 0.01);
  });

  it("LeftMenuButtonLogo check logo roadways", () => {
    props.children = <RoadwaysLogo />;

    cy.mount(() => (
      <LeftMenuButtonLogo
        isActive={props.isActive}
        isDisabled={props.isDisabled}
        children={props.children}
      />
    ));

    cy.get("svg").should("be.visible");
    cy.get("span").compareSnapshot("logo-roadways", 0.01);
  });

  it("LeftMenuButtonLogo check logo etablissement", () => {
    props.children = <EtablissementLogo />;

    cy.mount(() => (
      <LeftMenuButtonLogo
        isActive={props.isActive}
        isDisabled={props.isDisabled}
        children={props.children}
      />
    ));

    cy.get("svg").should("be.visible");
    cy.get("span").compareSnapshot("logo-etablissement", 0.01);
  });

  it("LeftMenuButtonLogo check logo arrets", () => {
    props.children = <ArretsLogo />;

    cy.mount(() => (
      <LeftMenuButtonLogo
        isActive={props.isActive}
        isDisabled={props.isDisabled}
        children={props.children}
      />
    ));

    cy.get("svg").should("be.visible");
    cy.get("span").compareSnapshot("logo-arrets", 0.01);
  });

  it("LeftMenuButtonLogo check logo setting", () => {
    props.children = <SettingsLogo />;

    cy.mount(() => (
      <LeftMenuButtonLogo
        isActive={props.isActive}
        isDisabled={props.isDisabled}
        children={props.children}
      />
    ));

    cy.get("svg").should("be.visible");
    cy.get("span").compareSnapshot("logo-setting", 0.01);
  });

  it("LeftMenuButtonLogo logo support", () => {
    props.children = <SupportLogo />;

    cy.mount(() => (
      <LeftMenuButtonLogo
        isActive={props.isActive}
        isDisabled={props.isDisabled}
        children={props.children}
      />
    ));

    cy.get("svg").should("be.visible");
    cy.get("span").compareSnapshot("logo-support", 0.01);
  });
});

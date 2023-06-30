import LeftMenuButtonLogo from "./LeftMenuButtonLogo";

import ArretsLogo from "../atom/ArretsLogo";
import DashboardLogo from "../atom/DashboardLogo";
import EtablissementLogo from "../atom/EtablissementLogo";
import GraphicageLogo from "../atom/GraphicageLogo";
import SettingsLogo from "../atom/SettingsLogo";
import SupportLogo from "../atom/SupportLogo";
import VoirieLogo from "../atom/VoirieLogo";

describe("LeftMenuButtonLogo component", () => {
  const props = {
    isActive: false,
    isDisabled: false,
    children: <div>Logo content</div>,
  };

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("span").compareSnapshot("logo-graphicage", 0.01);
  });

  it("LeftMenuButtonLogo check logo voirie", () => {
    props.children = <VoirieLogo />;

    cy.mount(() => (
      <LeftMenuButtonLogo
        isActive={props.isActive}
        isDisabled={props.isDisabled}
        children={props.children}
      />
    ));

    cy.get("svg").should("be.visible");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("span").compareSnapshot("logo-voirie", 0.01);
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("span").compareSnapshot("logo-support", 0.01);
  });
});

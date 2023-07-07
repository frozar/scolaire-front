import LoginAvatar from "./LoginAvatar";

/* eslint-disable @typescript-eslint/ban-ts-comment */

describe("LoginAvatar component", () => {
  const props = {
    authenticated: true,
    profilePicture:
      "https://raw.githubusercontent.com/frozar/scolaire-front/main/public/profile-picture.jpeg",
  };

  it("When authenticated", () => {
    cy.mount(() => (
      <LoginAvatar
        authenticated={props.authenticated}
        profilePicture={props.profilePicture}
      />
    ));

    cy.get("img").should("be.visible");
    cy.get("svg").should("not.exist");
  });

  it("When not authenticated", () => {
    cy.mount(() => (
      <LoginAvatar
        authenticated={!props.authenticated}
        profilePicture={undefined}
      />
    ));

    cy.get("img").should("not.exist");
    cy.get("svg").should("be.visible");

    //@ts-ignore
    cy.get("svg").compareSnapshot("login-avatar", 0.01);
  });
});

import LoginAvatar from "./LoginAvatar";

describe("LoginAvatar component", () => {
  it("When authenticated", () => {
    const props = {
      authenticated: true,
      profilePicture:
        "https://raw.githubusercontent.com/frozar/scolaire-front/main/public/profile-picture.jpeg",
    };

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
    const props = {
      authenticated: false,
      profilePicture:
        "https://raw.githubusercontent.com/frozar/scolaire-front/main/public/profile-picture.jpeg",
    };

    cy.mount(() => (
      <LoginAvatar
        authenticated={props.authenticated}
        profilePicture={props.profilePicture}
      />
    ));

    cy.get("img").should("not.exist");
    cy.get("svg").should("be.visible");
  });
});

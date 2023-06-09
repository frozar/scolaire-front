import LoginDropdown from "./LoginDropdown";

describe("LoginDropdown component", () => {
  const profilePictureUrl =
    "https://raw.githubusercontent.com/frozar/scolaire-front/main/public/profile-picture.jpeg";

  const props = {
    getProfilePicture: () => profilePictureUrl,
    authenticated: () => false,
    handleLogin: async () => console.log("ok"),
  };

  it("LoginDropdown check snapshot when not authentified", () => {
    cy.mount(() => (
      <LoginDropdown
        getProfilePicture={props.getProfilePicture}
        authenticated={props.authenticated}
        handleLogin={props.handleLogin}
      />
    ));

    cy.get("button").compareSnapshot("LoginDropdown-unauthentified", 0.01);
  });

  it("LoginDropdown check snapshot when authentified", () => {
    cy.intercept(profilePictureUrl).as("getProfilePicture");

    cy.mount(() => (
      <LoginDropdown
        getProfilePicture={props.getProfilePicture}
        authenticated={() => !props.authenticated()}
        handleLogin={props.handleLogin}
      />
    ));

    cy.wait("@getProfilePicture");
    cy.get("button").compareSnapshot("LoginDropdown-authentified", 0.01);
  });

  it("LoginDropdown toggle the sub-component when the button is clicked", () => {
    cy.mount(() => (
      <LoginDropdown
        getProfilePicture={props.getProfilePicture}
        authenticated={props.authenticated}
        handleLogin={props.handleLogin}
      />
    ));

    cy.get("#login-btn").click();
    cy.get("#login-menu-container").should("be.visible");

    cy.get("#login-btn").click();
    cy.get("#login-menu-container").should("not.exist");
  });

  it("LoginDropdown should call handleLogin when the sub-component is clicked", () => {
    const onClickSpy = cy.spy(props.handleLogin).as("handleLoginListener");

    cy.mount(() => (
      <LoginDropdown
        getProfilePicture={props.getProfilePicture}
        authenticated={props.authenticated}
        handleLogin={onClickSpy}
      />
    ));

    cy.get("#login-btn").click();
    cy.get("#login-menu-container").find("button").click();

    cy.get("@handleLoginListener").should("have.been.calledOnce");
  });
});

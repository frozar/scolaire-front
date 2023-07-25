import { ColorPicker } from "./ColorPicker";

describe("ColorPicker atom", () => {
  it("ColorPicker", () => {
    const onChange = (color: string) =>
      console.log("color onChange : " + color);
    const onInput = (color: string) => console.log("color onInput : " + color);

    cy.mount(() => (
      <ColorPicker
        color="#f3e6aa"
        title="Choisir une couleur"
        onInput={onInput}
        onChange={onChange}
      />
    ));
    cy.get(".color-picker").compareSnapshot("nominal", 0.01);
  });
});

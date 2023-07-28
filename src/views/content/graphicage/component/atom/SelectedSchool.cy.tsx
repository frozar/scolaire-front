import { PointInformation } from "./Point";
import SelectedSchool from "./SelectedSchool";

describe("SelectedSchool atom", () => {
  //TODO : add elements to schoolSelected array
  const schoolSelected: PointInformation[] = [
    {
      id: 0,
      idPoint: 1,
      lon: 20,
      lat: 20,
      name: "Etablissement test",
      quantity: 20,
    },
  ];

  it("SelectedSchool: no school", () => {
    cy.mount(() => <SelectedSchool schoolSelected={[]} />);
    cy.get(".selected-school").compareSnapshot("no school", 0.01);
  });

  it("SelectedSchool: no school", () => {
    cy.mount(() => <SelectedSchool schoolSelected={schoolSelected} />);
    cy.get(".selected-school").compareSnapshot("no school", 0.01);
  });
});

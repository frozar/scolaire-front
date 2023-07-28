import { PointInterface } from "./Point";
import SelectedSchool from "./SelectedSchool";

describe("SelectedSchool atom", () => {
  //TODO : add elements to schoolSelected array
  const schoolSelected: PointInterface[] = [];

  it("SelectedSchool: no school", () => {
    cy.mount(() => <SelectedSchool schoolSelected={[]} />);
    cy.get(".selected-school").compareSnapshot("no school", 0.01);
  });

  //   it("SelectedSchool: no school", () => {
  //     cy.mount(() => <SelectedSchool schoolSelected={schoolSelected} />);
  //     cy.get(".selected-school").compareSnapshot("no school", 0.01);
  //   });
});

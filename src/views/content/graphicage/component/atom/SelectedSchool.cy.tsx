import { createPoint } from "../../../../../../testing/utils/TestUtils";
import { NatureEnum } from "../../../../../type";
import { LeafletSchoolType } from "../organism/SchoolPoints";
import SelectedSchool from "./SelectedSchool";

describe("SelectedSchool atom", () => {
  const schoolSelected: LeafletSchoolType[] = [
    createPoint({
      id: 0,
      leafletId: 1,
      lon: 20,
      lat: 20,
      name: "Etablissement test",
      nature: NatureEnum.school,
    }),
  ];

  // TODO on ne peut pas faire de snapshot avec un affichage vide
  // it("SelectedSchool: no school", () => {
  //   cy.mount(() => <SelectedSchool schoolSelected={[]} />);
  //   cy.get(".selected-school").compareSnapshot("no school", 0.01);
  // });

  it("SelectedSchool", () => {
    cy.mount(() => <SelectedSchool schoolSelected={schoolSelected} />);
    cy.get(".selected-school").compareSnapshot("one school", 0.01);
  });
});

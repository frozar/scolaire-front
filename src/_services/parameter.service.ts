import { getSelectedOrganisation } from "../views/content/board/component/organism/OrganisationSelector";
import { ServiceUtils } from "./_utils.service";

export type organisationMember = {
  name: string;
  email: string;
  role: string;
  user_privilege: string;
};

export class ParameterService {
  static async getMember(): Promise<organisationMember[]> {
    const xanoResult = await ServiceUtils.get(
      "/organisation/" + getSelectedOrganisation().organisation_id + "/member",
      false
    );
    return xanoResult;
  }

  // //TODO change Omit to Pick
  // static async create(
  //   school: Omit<
  //     SchoolType,
  //     "id" | "selected" | "associated" | "setSelected" | "nature" | "leafletId"
  //   >
  // ): Promise<SchoolType> {
  //   const data = SchoolEntity.dbFormat(school);
  //   const dbSchool: SchoolDBType = await ServiceUtils.post("/school", data);
  //   return SchoolEntity.build(dbSchool);
  // }

  // static async update(
  //   school: Omit<
  //     SchoolType,
  //     "associated" | "selected" | "setSelected" | "nature" | "leafletId"
  //   >
  // ): Promise<SchoolType> {
  //   const data = SchoolEntity.dbFormat(school);
  //   const dbSchool: SchoolDBType = await ServiceUtils.patch(
  //     "/school/" + school.id,
  //     data
  //   );
  //   if (dbSchool == null) return dbSchool;
  //   return SchoolEntity.build(dbSchool);
  // }

  // // TODO no tested : school supression process on stand by
  // static async delete(id: number): Promise<number> {
  //   return await ServiceUtils.delete("/school/" + id);
  // }
}

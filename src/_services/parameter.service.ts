import { getSelectedOrganisation } from "../views/content/board/component/organism/OrganisationSelector";
import { ServiceUtils } from "./_utils.service";

export type organisationMember = {
  id: number;
  name: string;
  email: string;
  role: string;
  user_privilege: string;
  user_id: number;
};

export class ParameterService {
  static async getMember(): Promise<organisationMember[]> {
    const xanoResult = await ServiceUtils.get(
      "/organisation/" + getSelectedOrganisation().organisation_id + "/member",
      false
    );
    return xanoResult;
  }

  static async addMember(memberMail: string): Promise<organisationMember> {
    const xanoResult = await ServiceUtils.post(
      "/organisation/" + getSelectedOrganisation().organisation_id + "/member",
      { email: memberMail },
      false
    );
    return xanoResult;
  }

  static async delete(id: number): Promise<organisationMember> {
    return await ServiceUtils.delete(
      "/organisation/" +
        getSelectedOrganisation().organisation_id +
        "/member/" +
        id,
      false
    );
  }

  static async update(member: organisationMember): Promise<organisationMember> {
    return await ServiceUtils.patch(
      "/organisation/" + getSelectedOrganisation().organisation_id + "/member",
      {
        user_id: member.user_id,
        user_privilege: member.user_privilege,
        id: member.id,
      },
      false
    );
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

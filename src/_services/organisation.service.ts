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

export class OrganisationService {
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

  static async deleteMember(id: number): Promise<organisationMember> {
    return await ServiceUtils.delete(
      "/organisation/" +
        getSelectedOrganisation().organisation_id +
        "/member/" +
        id,
      false
    );
  }

  static async updateMember(
    member: organisationMember
  ): Promise<organisationMember> {
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
}

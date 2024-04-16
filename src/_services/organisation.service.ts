import {
  OrganizationDbType,
  OrganizationEntity,
  OrganizationType,
} from "../_entities/organization.entity";
import { getSelectedOrganisation } from "../views/content/board/component/organism/OrganisationSelector";
import { ServiceUtils } from "./_utils.service";

export type OrganizationMemberType = {
  id: number;
  name: string;
  email: string;
  // TODO: Use enum for role and user_privilege
  role: string;
  user_privilege: string;
  user_id: number;
};

export class OrganisationService {
  static async create(org: Omit<OrganizationType, "id">) {
    const data = OrganizationEntity.dbFormat(org, true);
    const xanoResult = await ServiceUtils.post("/organization", data, false);
    return OrganizationEntity.build(xanoResult);
  }

  static async getAll(): Promise<OrganizationType[]> {
    const xanoResult: OrganizationDbType[] = await ServiceUtils.get(
      "/organization",
      false
    );
    return xanoResult.map((dbOrga) => OrganizationEntity.build(dbOrga));
  }

  static async edit(org: OrganizationType): Promise<OrganizationType> {
    const data = OrganizationEntity.dbFormat(org, false);
    const xanoResult: OrganizationDbType = await ServiceUtils.patch(
      "/organization/" + org.id,
      data,
      false
    );
    return OrganizationEntity.build(xanoResult);
  }

  static async getMembers(): Promise<OrganizationMemberType[]> {
    const xanoResult = await ServiceUtils.get(
      "/organisation/" + getSelectedOrganisation().organisation_id + "/member",
      false
    );
    return xanoResult;
  }

  static async addMember(memberMail: string): Promise<OrganizationMemberType> {
    const xanoResult = await ServiceUtils.post(
      "/organisation/" + getSelectedOrganisation().organisation_id + "/member",
      { email: memberMail },
      false
    );
    return xanoResult;
  }

  static async deleteMember(id: number): Promise<OrganizationMemberType> {
    return await ServiceUtils.delete(
      "/organisation/" +
        getSelectedOrganisation().organisation_id +
        "/member/" +
        id,
      false
    );
  }

  static async updateMember(
    member: OrganizationMemberType
  ): Promise<OrganizationMemberType> {
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

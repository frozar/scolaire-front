import { OrganizationMemberType } from "../_services/organisation.service";

export namespace OrganizationEntity {
  export function build(dbOrganization: OrganizationDbType): OrganizationType {
    //TODO to improve
    return dbOrganization;
  }

  export function dbFormat(organization: OrganizationType) {
    return {
      id: organization.id,
      name: organization.name,
      status: organization.status,
      referent_id: organization.referent.id,
    };
  }
}

export type OrganizationDbType = {
  id?: number;
  name: string;
  referent: OrganizationMemberType;
  status: string;
};
export type OrganizationType = {
  id?: number;
  name: string;
  referent: OrganizationMemberType;
  status: string;
};

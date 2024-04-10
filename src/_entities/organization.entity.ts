import { OrganizationMemberType } from "../_services/organisation.service";

export namespace OrganizationEntity {
  export function build(dbOrganization: OrganizationDbType): OrganizationType {
    //TODO to improve
    return dbOrganization;
  }
}

export type OrganizationDbType = {
  name: string;
  referent: OrganizationMemberType;
};
export type OrganizationType = {
  name: string;
  referent: OrganizationMemberType;
};

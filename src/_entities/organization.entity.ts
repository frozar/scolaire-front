import { OrganizationMemberType } from "../_services/organisation.service";

export namespace OrganizationEntity {
  export function build(dbOrganization: OrganizationDbType): OrganizationType {
    //TODO to improve
    return dbOrganization;
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

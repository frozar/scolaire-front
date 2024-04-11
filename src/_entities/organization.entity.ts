import { OrganizationMemberType } from "../_services/organisation.service";

export namespace OrganizationEntity {
  export function build(dbOrganization: OrganizationDbType): OrganizationType {
    return {
      id: dbOrganization.id,
      name: dbOrganization.name,
      status: dbOrganization.status,
      referent: dbOrganization.referent,
    };
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

export type OrganizationMapBoundType = {
  corner1: { lat: number; lon: number };
  corner2: { lat: number; lon: number };
};

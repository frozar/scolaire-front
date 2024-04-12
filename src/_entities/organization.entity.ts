import { OrganizationMemberType } from "../_services/organisation.service";

export namespace OrganizationEntity {
  export function build(dbOrganization: OrganizationDbType): OrganizationType {
    return {
      id: dbOrganization.id,
      name: dbOrganization.name,
      status: dbOrganization.status,
      referent: dbOrganization.referent,
      mapBounds: dbOrganization.map_bounds,
    };
  }

  export function dbFormat(organization: OrganizationType) {
    return {
      id: organization.id,
      name: organization.name,
      status: organization.status,
      referent_id: organization.referent.user_id,
      map_bounds: organization.mapBounds,
    };
  }
}

export type OrganizationDbType = {
  id?: number;
  name: string;
  referent: OrganizationMemberType;
  status: string;
  map_bounds: OrganizationMapBoundType;
};
export type OrganizationType = {
  id?: number;
  name: string;
  referent: OrganizationMemberType;
  status: string;
  mapBounds: OrganizationMapBoundType;
};

export type OrganizationMapBoundType = {
  corner1: { lat: number; lng: number };
  corner2: { lat: number; lng: number };
};

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
      referent_id: organization.referent.id,
      map_bounds: organization.mapBounds,
    };
  }

  export function defaultOrganization(): OrganizationType {
    return {
      name: "",
      referent: {} as OrganizationMemberType,
      status: "active",
      mapBounds: defaultOrganizationMapBounds(),
    };
  }

  export function defaultOrganizationMapBounds(): OrganizationMapBoundType {
    return {
      corner1: {
        lat: -20.85449703579938,
        lng: 55.528209081343114,
      },
      corner2: {
        lat: -20.965017690196024,
        lng: 55.40989679654955,
      },
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

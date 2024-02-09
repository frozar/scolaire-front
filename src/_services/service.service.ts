import { ServiceDBType, ServiceEntity } from "../_entities/service.entity";
import { ServiceType } from "../views/content/service/organism/Services";
import { ServiceUtils } from "./_utils.service";

export type ServiceUpdateType = {
  toAdd: ServiceType[];
  toModify: ServiceType[];
  toDelete: number[];
};

export type ServiceUpdateDBType = {
  to_add: ServiceDBType[];
  to_modify: ServiceDBType[];
  to_delete: number[];
};

export namespace ServiceService {
  export async function update(
    servcicesData: ServiceUpdateType
  ): Promise<ServiceType[]> {
    const data: ServiceUpdateDBType =
      ServiceEntity.dbFormatServiceUpdate(servcicesData);

    const dbData: ServiceDBType[] = await ServiceUtils.patch("/service", data);

    return dbData.map((dbService) => ServiceEntity.build(dbService));
  }
}

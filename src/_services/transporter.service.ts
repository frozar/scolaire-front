import {
  TransporterDbType,
  TransporterEntity,
  TransporterType,
} from "../_entities/transporter.entity";
import { ServiceUtils } from "./_utils.service";

export namespace TransporterService {
  export async function create(transporter: Omit<TransporterType, "id">) {
    const data = TransporterEntity.dbFormat(transporter);
    const dbTransporter: TransporterDbType = await ServiceUtils.post(
      "/transporter",
      data
    );
    return TransporterEntity.build(dbTransporter);
  }

  export async function update(transporter: TransporterType) {
    const data = TransporterEntity.dbFormat(transporter);
    const dbTransporter: TransporterDbType = await ServiceUtils.patch(
      "/transporter/" + transporter.id,
      data
    );
    return TransporterEntity.build(dbTransporter);
  }

  export async function deleteTransporter(id?: number): Promise<boolean> {
    const returnValue: boolean = await ServiceUtils.delete(
      "/transporter/" + id
    );
    return returnValue;
  }
}

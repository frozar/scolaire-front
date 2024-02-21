import { TransporterType } from "../_entities/transporter.entity";
import { setAllTransporter } from "../views/content/allotment/molecule/TransporterTable";
import { ServiceUtils } from "./_utils.service";

export namespace TransporterService {
  export async function create(transporter: Omit<TransporterType, "id">) {
    const dbTransporter: TransporterType[] = await ServiceUtils.post(
      "/transporter",
      transporter
    );
    setAllTransporter(dbTransporter);
  }
}

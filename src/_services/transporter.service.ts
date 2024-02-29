import { TransporterType } from "../_entities/transporter.entity";
import { setAllTransporter } from "../views/content/allotment/molecule/TransporterTable";
import { ServiceUtils } from "./_utils.service";

export namespace TransporterService {
  export async function importTransporters(transporters: TransporterType[]) {
    const dbTransporter: TransporterType[] = await ServiceUtils.post(
      "/import/transporters",
      {
        transporters: transporters,
      }
    );
    return dbTransporter;
  }

  export async function create(transporter: Omit<TransporterType, "id">) {
    const dbTransporter: TransporterType[] = await ServiceUtils.post(
      "/transporter",
      transporter
    );
    setAllTransporter(dbTransporter);
  }

  export async function update(transporter: Partial<TransporterType>) {
    const dbTransporter: TransporterType = await ServiceUtils.patch(
      "/transporter/" + transporter.id,
      transporter
    );
    setAllTransporter((prev) => {
      if (!prev) return prev;
      return [...prev].map((transporter) => {
        if (transporter.id == dbTransporter.id) {
          transporter = dbTransporter;
        }
        return transporter;
      });
    });
  }

  export async function deleteTransporter(id?: number): Promise<boolean> {
    const returnValue: boolean = await ServiceUtils.delete(
      "/transporter/" + id
    );
    setAllTransporter((prev) => {
      if (!prev) return prev;
      return [...prev].filter((transporter) => {
        if (transporter.id == id) {
          return;
        }
        return transporter;
      });
    });
    return returnValue;
  }
}

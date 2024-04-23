import {
  FlatGraphicEntity,
  FlatGraphicType,
} from "../_entities/flatGraphic.entity";
import { ServiceUtils } from "./_utils.service";

export namespace FlatGraphicService {
  export async function create(graphic: Omit<FlatGraphicType, "id">) {
    const data = FlatGraphicEntity.dbFormat(graphic);
    const dbGraphic = await ServiceUtils.post("/flat_graphic", data);
    return FlatGraphicEntity.build(dbGraphic);
  }

  export async function update(graphic: FlatGraphicType) {
    const data = FlatGraphicEntity.dbFormat(graphic);
    const dbGraphic = await ServiceUtils.patch(
      "/flat_graphic/" + graphic.id,
      data
    );
    return FlatGraphicEntity.build(dbGraphic);
  }
}

import { layerTilesList } from "../../../constant";
import { TileId } from "../../../type";

export const getTileById = (tileId: TileId) => {
  const tile = layerTilesList.filter((tile) => tile.tileId == tileId);
  return tile[0];
};

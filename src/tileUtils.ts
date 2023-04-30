import { layerTilesList } from "./constant";

export const getTileByName = (tile_name: string) => {
  const tile = layerTilesList.filter((_tile) => _tile.tileId == tile_name);
  return tile[0];
};

import { layerTilesList } from "./constant"

export const getTileByName = (tile_name: string) => {
    const tile = layerTilesList.filter(_tile => _tile.tile_name == tile_name)
    return tile[0]
}
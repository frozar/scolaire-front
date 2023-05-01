// @ts-expect-error
import MiniMap from "leaflet-minimap";

import { getLeafletMap } from "../signaux";
import { layerTilesList } from "../constant";
import { getTileByName } from "../tileUtils";
import { useStateGui } from "../StateGui";
import { createEffect } from "solid-js";
import { TileType } from "../type";

function LayerLogo() {
  return (
    <svg
      id="map-settings"
      class="cursor-pointer"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_501_2)">
        <path
          d="M50.0491 9.51002C49.4203 9.50653 48.7966 9.57196 48.2145 9.70246C47.6324 9.83297 47.1036 10.0259 46.6591 10.27L1.3821 35.115C0.943081 35.3558 0.594822 35.6417 0.357217 35.9564C0.119611 36.2711 -0.00268555 36.6084 -0.00268555 36.949C-0.00268555 37.2897 0.119611 37.6269 0.357217 37.9416C0.594822 38.2563 0.943081 38.5422 1.3821 38.783L46.6581 63.63C47.0969 63.871 47.6179 64.0621 48.1913 64.1925C48.7647 64.3229 49.3794 64.39 50.0001 64.39C50.6208 64.39 51.2354 64.3229 51.8089 64.1925C52.3823 64.0621 52.9033 63.871 53.3421 63.63L98.6171 38.784C99.0561 38.5432 99.4044 38.2573 99.642 37.9426C99.8796 37.6279 100.002 37.2906 100.002 36.95C100.002 36.6094 99.8796 36.2721 99.642 35.9574C99.4044 35.6427 99.0561 35.3568 98.6171 35.116L53.3421 10.27C52.468 9.78996 51.2857 9.5171 50.0491 9.51002ZM4.7271 46.332L1.3831 48.166C0.944081 48.4068 0.595822 48.6927 0.358217 49.0074C0.120611 49.3221 -0.00168555 49.6594 -0.00168555 50C-0.00168555 50.3406 0.120611 50.6779 0.358217 50.9926C0.595822 51.3073 0.944081 51.5932 1.3831 51.834L46.6581 76.68C47.0969 76.921 47.6179 77.1121 48.1913 77.2425C48.7647 77.3729 49.3794 77.44 50.0001 77.44C50.6208 77.44 51.2354 77.3729 51.8089 77.2425C52.3823 77.1121 52.9033 76.921 53.3421 76.68L98.6171 51.834C99.056 51.5931 99.4041 51.3072 99.6415 50.9925C99.879 50.6777 100.001 50.3404 100.001 49.9998C100.001 49.6592 99.8782 49.3219 99.6404 49.0072C99.4027 48.6926 99.0542 48.4067 98.6151 48.166L95.2731 46.332L88.5901 49.998L88.5941 50L50.0001 71.18L11.4041 50L11.4081 49.998L4.7271 46.332ZM4.7271 59.382L1.3831 61.217C0.944081 61.4578 0.595822 61.7437 0.358217 62.0584C0.120611 62.3731 -0.00168555 62.7104 -0.00168555 63.051C-0.00168555 63.3916 0.120611 63.7289 0.358217 64.0436C0.595822 64.3583 0.944081 64.6442 1.3831 64.885L46.6581 89.73C47.0969 89.971 47.6179 90.1621 48.1913 90.2925C48.7647 90.4229 49.3794 90.49 50.0001 90.49C50.6208 90.49 51.2354 90.4229 51.8089 90.2925C52.3823 90.1621 52.9033 89.971 53.3421 89.73L98.6171 64.885C99.056 64.6441 99.4041 64.3582 99.6415 64.0435C99.879 63.7287 100.001 63.3914 100.001 63.0508C100.001 62.7102 99.8782 62.3729 99.6404 62.0582C99.4027 61.7436 99.0542 61.4577 98.6151 61.217L95.2731 59.383L88.5901 63.049L88.5941 63.051L50.0001 84.23L11.4041 63.05L11.4081 63.048L4.7271 59.382Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_501_2">
          <rect width="100" height="100" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function () {
  let refMapLayerTilesList: HTMLElement | undefined = undefined;

  const [
    state,
    { setSelectedTile, toggleDisplayedRightMenu, getDisplayedRightMenu },
  ] = useStateGui();

  /**
   * Get tile name from HTML map container attributes
   * Set new map title with the current tile name
   * remove current basemap tile
   * change minimap layer tile with the basemap tile
   *
   * set new attributes "data-tile-name" to map_container
   *
   * @param mapContainer
   * @param minimap
   */
  const tileChangeOnClick = (
    mapContainer: HTMLDivElement,
    minimap: MiniMap,
    leafletMap: L.Map
  ) => {
    // Will be the new tile of basemap
    const tile = getTileByName(
      // TODO: don't rely on custom attribut in the DOM
      // @ts-expect-error
      mapContainer.attributes["data-tile-name"].value
    );
    // TODO: Don't access directly to "state.onTile": create a getter
    mapContainer.children[1].innerHTML = state.selectedTile;

    leafletMap.removeLayer(getTileByName(state.selectedTile).tileContent);
    minimap.changeLayer(getTileByName(state.selectedTile).tileContent);

    mapContainer.setAttribute(
      "data-tile-name",
      getTileByName(state.selectedTile).tileId
    );
    setSelectedTile(tile.tileId);
    leafletMap.addLayer(tile.tileContent);
  };

  const buildMinimaps = (tile: TileType, leafletMap: L.Map) => {
    const mapContainer = document.createElement("div");
    const mapTitle = document.createElement("p");

    mapContainer.classList.add("tiles-map");
    mapContainer.setAttribute("data-tile-name", tile.tileId);

    // TODO: Don't rely on the innerText DOM field
    mapTitle.innerText = tile.tileId;

    if (state.selectedTile != tile.tileId) {
      // TODO: don't change the zoom of the map
      const minimap = new MiniMap(tile.tileContent, {
        zoomLevelOffset: -3.5,
      }).addTo(leafletMap);
      minimap._map.fitBounds(leafletMap?.getBounds());

      // minimap.fitBounds(getLeafletMap().getBounds())
      const minimapContainer = minimap.getContainer();

      mapContainer.appendChild(minimapContainer);
      mapContainer.appendChild(mapTitle);
      refMapLayerTilesList?.appendChild(mapContainer);

      mapContainer.addEventListener("click", (e) =>
        tileChangeOnClick(mapContainer, minimap, leafletMap)
      );
    }
  };

  let initialised = false;

  createEffect(() => {
    if (initialised) {
      return;
    }

    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }

    layerTilesList.forEach((tile) => buildMinimaps(tile, leafletMap));
    initialised = true;
  });

  return (
    <>
      <button
        class="side-map-menu min-w-[40px]"
        classList={{ active: getDisplayedRightMenu() }}
        onClick={toggleDisplayedRightMenu}
      >
        <LayerLogo />
      </button>

      <section
        id="side-map-toggler"
        classList={{ active: getDisplayedRightMenu() }}
      >
        <header>Réglages du fond de carte</header>

        <section id="map-layer-tiles-list" ref={refMapLayerTilesList}></section>
      </section>
    </>
  );
}

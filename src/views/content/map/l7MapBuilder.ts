import L from "leaflet";
import { createEffect, createSignal } from "solid-js";
import { useStateGui } from "../../../StateGui";
import {
  disableSpinningWheel,
  enableSpinningWheel,
  setLeafletMap,
} from "../../../signaux";
import { MapElementUtils } from "../../../utils/mapElement.utils";
import {
  changeBoard,
  isInDrawMod,
  onBoard,
} from "../board/component/template/ContextManager";
import FlaxibMapLogo from "./FlaxibMapLogo";
import { ways } from "./Map";
import {
  getSelectedWays,
  setSelectedWays,
} from "./component/molecule/LineWeight";
import { getTileById } from "./tileUtils";
const [
  ,
  {
    getSelectedReadModeTile,
    getSelectedEditModeTile,
    setSelectedEditModeTile,
    setSelectedReadModeTile,
    getSelectedMenu,
  },
] = useStateGui();

export const [isOverMapItem, setIsOverMapItem] = createSignal(false);

function addLogoFlaxib(map: L.Map) {
  const logoControl = L.Control.extend({
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
    options: {
      position: "bottomleft",
    },

    onAdd: FlaxibMapLogo,
  });
  new logoControl().addTo(map);
}
const trueFn = function () {
  return true;
};
export function buildMapL7(div: HTMLDivElement) {
  enableSpinningWheel();
  L.Map.SelectArea = L.Map.BoxZoom.extend({
    statics: {
      /**
       * @static
       * @type {String}
       */
      AREA_SELECTED: "areaselected",

      /**
       * @static
       * @type {String}
       */
      AREA_SELECT_START: "areaselectstart",

      /**
       * @static
       * @type {String}
       */
      AREA_SELECTION_TOGGLED: "areaselecttoggled",
    },

    options: {
      shiftKey: false,
      ctrlKey: true,
      validate: trueFn,
      autoDisable: false,
      cursor: "crosshair",
    },

    /**
     * @param  {L.Map} map
     * @constructor
     */
    initialize: function (map, options) {
      L.Util.setOptions(this, options || {});
      L.Map.BoxZoom.prototype.initialize.call(this, map);

      /**
       * @type {Function}
       */
      this._validate = null;

      /**
       * @type {Boolean}
       */
      this._moved = false;

      /**
       * @type {Boolean}
       */
      this._autoDisable = !this.options.ctrlKey && this.options.autoDisable;

      /**
       * @type {L.Point}
       */
      this._lastLayerPoint = null;

      /**
       * @type {String|Null}
       */
      this._beforeCursor = null;

      this.setValidate(this.options.validate);
      this.setAutoDisable(this.options.autoDisable);
    },

    /**
     * @param  {Function=} validate
     * @return {SelectArea}
     */
    setValidate: function (validate) {
      const handler = this;
      if (typeof validate !== "function") {
        validate = trueFn;
      }
      this._validate = function (layerPoint) {
        return validate.call(handler, layerPoint);
      };
      return this;
    },

    /**
     * @param {Boolean} autoDisable
     */
    setAutoDisable: function (autoDisable) {
      this._autoDisable = !!autoDisable;
    },

    /**
     * @param {Boolean} on
     */
    setControlKey: function (on) {
      const wasEnabled = this._enabled;
      if (wasEnabled) this.disable();
      this.options.ctrlKey = !!on;
      if (on) this.options.shiftKey = false;
      if (wasEnabled) this.enable();
    },

    /**
     * @param {Boolean} on
     */
    setShiftKey: function (on) {
      const wasEnabled = this._enabled;
      if (wasEnabled) this.disable();
      this.options.shiftKey = !!on;
      if (on) this.options.ctrlKey = false;
      if (wasEnabled) this.enable();
    },

    /**
     * Disable dragging or zoombox
     * @param {Function=} validate
     * @param {Boolean=}  autoDisable
     */
    enable: function (validate, autoDisable) {
      if (this.options.shiftKey) {
        if (this._map.boxZoom) {
          this._map.boxZoom.disable();
        }
      } else if (!this.options.ctrlKey) {
        this._map.dragging.disable();
      }
      L.Map.BoxZoom.prototype.enable.call(this);

      if (!this.options.ctrlKey) this._setCursor();

      if (validate) this.setValidate(validate);
      this.setAutoDisable(autoDisable);

      this._map.fire(L.Map.SelectArea.AREA_SELECTION_TOGGLED);
    },

    /**
     * Re-enable box zoom or dragging
     */
    disable: function () {
      L.Map.BoxZoom.prototype.disable.call(this);

      if (!this.options.ctrlKey) this._restoreCursor();

      if (this.options.shiftKey) {
        if (this._map.boxZoom) {
          this._map.boxZoom.enable();
        }
      } else {
        this._map.dragging.enable();
      }

      this._map.fire(L.Map.SelectArea.AREA_SELECTION_TOGGLED);
    },

    /**
     * Also listen to ESC to cancel interaction
     * @override
     */
    addHooks: function () {
      L.Map.BoxZoom.prototype.addHooks.call(this);
      L.DomEvent.on(document, "keyup", this._onKeyUp, this)
        .on(document, "keydown", this._onKeyPress, this)
        .on(document, "contextmenu", this._onMouseDown, this)
        .on(window, "blur", this._onBlur, this);
      this._map.on("dragstart", this._onMouseDown, this);
    },

    /**
     * @override
     */
    removeHooks: function () {
      L.Map.BoxZoom.prototype.removeHooks.call(this);
      L.DomEvent.off(document, "keyup", this._onKeyUp, this)
        .off(document, "keydown", this._onKeyPress, this)
        .off(document, "contextmenu", this._onMouseDown, this)
        .off(window, "blur", this._onBlur, this);
      this._map.off("dragstart", this._onMouseDown, this);
    },

    /**
     * @override
     */
    _onMouseDown: function (e) {
      this._moved = false;
      this._lastLayerPoint = null;

      if (
        (this.options.shiftKey && !e.shiftKey) ||
        (this.options.ctrlKey && !e.ctrlKey) ||
        (e.which !== 1 && e.button !== 1)
      ) {
        return false;
      }

      L.DomEvent.stop(e);

      const layerPoint = this._map.mouseEventToLayerPoint(e);
      if (!this._validate(layerPoint)) return false;

      L.DomUtil.disableTextSelection();
      L.DomUtil.disableImageDrag();

      this._startLayerPoint = layerPoint;

      L.DomEvent.on(document, "mousemove", this._onMouseMove, this)
        .on(document, "mouseup", this._onMouseUp, this)
        .on(document, "keydown", this._onKeyDown, this);
    },

    /**
     * @override
     */
    _onMouseMove: function (e) {
      console.log("jemove");
      if (!this._moved) {
        this._box = L.DomUtil.create("div", "leaflet-zoom-box", this._pane);
        L.DomUtil.setPosition(this._box, this._startLayerPoint);
        this._map.fire(L.Map.SelectArea.AREA_SELECT_START);
      }

      const startPoint = this._startLayerPoint;
      const box = this._box;

      const layerPoint = this._map.mouseEventToLayerPoint(e);
      const offset = layerPoint.subtract(startPoint);

      if (!this._validate(layerPoint)) return;
      this._lastLayerPoint = layerPoint;

      const newPos = new L.Point(
        Math.min(layerPoint.x, startPoint.x),
        Math.min(layerPoint.y, startPoint.y)
      );

      L.DomUtil.setPosition(box, newPos);

      this._moved = true;

      // TODO refactor: remove hardcoded 4 pixels
      box.style.width = Math.max(0, Math.abs(offset.x) - 4) + "px";
      box.style.height = Math.max(0, Math.abs(offset.y) - 4) + "px";
    },

    /**
     * General on/off toggle
     * @param  {KeyboardEvent} e
     */
    _onKeyUp: function (e) {
      if (e.keyCode === 27) {
        if (this._moved && this._box) {
          this._finish();
        }
        // this.disable();
      } else if (this.options.ctrlKey) {
        this._restoreCursor();
        this._map.dragging.enable();
      }
    },

    /**
     * Key down listener to enable on ctrl-press
     * @param  {KeyboardEvent} e
     */
    _onKeyPress: function (e) {
      if (
        this.options.ctrlKey &&
        (e.ctrlKey || e.type === "dragstart") &&
        this._beforeCursor === null
      ) {
        this._setCursor();
        this._map.dragging._draggable._onUp(e); // hardcore
        this._map.dragging.disable();
      }
    },

    /**
     * Window blur listener to restore state
     * @param  {Event} e
     */
    _onBlur: function (e) {
      this._restoreCursor();
      this._map.dragging.enable();
    },

    /**
     * Set crosshair cursor
     */
    _setCursor: function () {
      this._beforeCursor = this._container.style.cursor;
      this._container.style.cursor = this.options.cursor;
    },

    /**
     * Restore status quo cursor
     */
    _restoreCursor: function () {
      this._container.style.cursor = this._beforeCursor;
      this._beforeCursor = null;
    },

    /**
     * @override
     */
    _onMouseUp: function (e) {
      this._finish();

      const map = this._map;
      const layerPoint = this._lastLayerPoint; // map.mouseEventToLayerPoint(e);

      if (!layerPoint || this._startLayerPoint.equals(layerPoint)) return;
      L.DomEvent.stop(e);

      const bounds = new L.LatLngBounds(
        map.layerPointToLatLng(this._startLayerPoint),
        map.layerPointToLatLng(layerPoint)
      );
      console.log(bounds);
      const ways_id: number[] = [];
      map.eachLayer(function (layer) {
        if (layer instanceof L.Polyline) {
          if (bounds.intersects(layer.getBounds())) {
            // console.log(layer);
            ways_id.push(layer.lineId);
          }
        }
      });
      setSelectedWays(
        ways().filter((elem) => ways_id.includes(elem.flaxib_way_id))
      );
      console.log("selected ways", getSelectedWays());

      //map.fitBounds(bounds);

      if (this._autoDisable) {
        this.disable();
      } else {
        this._restoreCursor();
      }

      this._moved = false;

      L.Util.requestAnimFrame(function () {
        map.fire(L.Map.SelectArea.AREA_SELECTED, {
          bounds: bounds,
        });
      });
    },
  });

  // expose setting
  L.Map.mergeOptions({
    selectArea: true,
  });

  // register hook
  L.Map.addInitHook("addHandler", "selectArea", L.Map.SelectArea);

  const leafletMap = new L.Map(div, {
    zoomControl: false,
    zoomSnap: 0.1,
    zoomDelta: 0.1,
    wheelPxPerZoomLevel: 200,
    tap: false,
  }).setView([-20.930746, 55.527503], 13);

  // let map = new L.Map("map", {
  //   selectArea: true, // will enable it by default
  // });

  // const areaSelection = new DrawAreaSelection({
  //   onPolygonReady: (polygon) => {
  //     console.log("polygon", polygon);
  //   },
  //   onButtonActivate: () => {
  //     // const preview = document.getElementById("polygon");
  //     // preview.textContent = "Please, draw your polygon";
  //     console.log("Please, draw your polygon");
  //   },
  //   onButtonDeactivate: (polygon) => {
  //     console.log("Deactivated! Current polygon is:" + polygon);
  //   },
  //   position: "topleft",
  // }).setPosition("bottomright") as L.Control;

  // leafletMap.addControl(areaSelection);

  setLeafletMap(leafletMap);

  // Check which map ground must be displayed
  const readTile = () => {
    return getTileById(getSelectedReadModeTile()).tileContent;
  };

  const editTile = () => {
    return getTileById(getSelectedEditModeTile()).tileContent;
  };

  const [currentTileLayer, setCurrentTileLayer] = createSignal<
    L.TileLayer | undefined
  >();

  createEffect(() => {
    // TODO delete the two setters and check why the tiles' default parameters are not respected and fix it
    setSelectedReadModeTile("OpenStreetMap_Mapnik");
    setSelectedEditModeTile("Esri_WorldTopoMap");

    setCurrentTileLayer(() => {
      if (!isInDrawMod()) {
        return readTile();
      } else {
        return editTile();
      }
    });
  });

  createEffect(() => {
    leafletMap.eachLayer(function (layer) {
      if (layer instanceof L.TileLayer) {
        layer.remove();
      }
    });
    currentTileLayer()?.remove();
    currentTileLayer()?.addTo(leafletMap);
  });

  leafletMap.addEventListener("click", (e) => {
    console.log("test");
    if (
      !isOverMapItem() &&
      onBoard() != "trip-draw" &&
      onBoard() != "line-add" &&
      onBoard() != "path-draw"
    ) {
      if (getSelectedMenu() != "voirie") {
        changeBoard("line");
      }
      MapElementUtils.deselectAllPointsAndBusTrips();
    }
  });

  leafletMap.addEventListener("mouseup", (e) => {
    console.log("test2");
  });

  addLogoFlaxib(leafletMap);
  // initScreenshoter();

  // The argument in the constructor of the 'L7Layer' is simply pass to
  // Leaflet Layer as options for the constructor
  // const l7layer = new L7Layer({});
  // l7layer.addTo(leafletMap);

  // const scene = l7layer.getScene();

  // // Remove the L7 logo
  // scene.removeControl(scene.getControlByName("logo"));

  // // To retrieve control over the cursor, remove the 'l7-interactive' class
  // scene.getMapCanvasContainer().classList.remove("l7-interactive");
  disableSpinningWheel();
}

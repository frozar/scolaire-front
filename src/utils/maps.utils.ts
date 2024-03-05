import L from "leaflet";
import { useStateGui } from "../StateGui";
import { MapType } from "../_entities/map.entity";
import { MapService } from "../_services/map.service";
import { setUserMaps } from "../_stores/map.store";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";
import { ways } from "../views/content/map/Map";
import {
  getSelectedWays,
  setSelectedWays,
} from "../views/content/map/component/molecule/LineWeight";

const [, { setActiveMapId }] = useStateGui();

export namespace MapsUtils {
  export function getSelectedMap(maps: MapType[]): MapType | null {
    let map = null;
    for (const _map of maps) {
      if (_map.isActive()) {
        map = _map;
      }
    }
    return map;
  }

  export function setActiveMap(mapId: number) {
    setUserMaps((prev) =>
      [...prev].map((map) => {
        map.setIsActive(map.id === mapId);
        return map;
      })
    );
    setActiveMapId(mapId);
  }

  export async function updateMap(map: Partial<MapType>) {
    const updatedMap = await MapService.update(map as MapType);
    enableSpinningWheel();
    setUserMaps((prev) =>
      [...prev].map((map_) => {
        if (map_.id == map.id) {
          return updatedMap;
        }
        return map_;
      })
    );
    disableSpinningWheel();
  }

  export async function createMap(map: Partial<MapType>) {
    const newMap: MapType = await MapService.create({
      name: map.name as string,
    });
    if (!newMap) return false;

    setUserMaps((prev) => [...prev, newMap]);
    MapsUtils.setActiveMap(newMap.id);
  }

  export function initLmap() {
    const trueFn = () => true;
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
  }
}

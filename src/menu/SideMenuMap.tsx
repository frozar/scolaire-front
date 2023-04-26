import { createEffect, onMount } from "solid-js"
import L from "leaflet";
import { getLeafletMap } from "../global/leafletMap";

import { OpenStreetMap_Mapnik, layerTilesList, Stadia_AlidadeSmooth, Stadia_Outdoors } from "../constant";
import { onTiles } from "../signaux";

var ref_side_menu_close_toggler_btn: HTMLDivElement;
var ref_side_menu_toggler_btn: SVGSVGElement;
var map_layer_tiles_list: HTMLElement;
var side_menu_toggler: HTMLElement;
var toggle_active: Boolean;



export default function SideMapMenu() {
    toggle_active = false

    const openCloseToggler = () => {
        if(toggle_active) {
            side_menu_toggler?.classList.remove('active');
            ref_side_menu_toggler_btn.parentElement?.classList.remove('active')
        }
        else{
            side_menu_toggler?.classList.add('active');
            ref_side_menu_toggler_btn.parentElement?.classList.add('active')
        }

        
        toggle_active = !toggle_active;
    }

    document.addEventListener('DOMContentLoaded', () => {
        
        Stadia_Outdoors.addTo(getLeafletMap());
        
    })

    onMount(function(){
        ref_side_menu_toggler_btn?.addEventListener('click', () => { openCloseToggler() })
        ref_side_menu_close_toggler_btn?.addEventListener('click', () => { openCloseToggler() })

        layerTilesList.forEach(tile => {
            const map_container = document.createElement('div')
            const text = document.createElement('p')


            map_container.id = 'map-' + tile.tile_name
            map_container.classList.add('tiles-map')
            map_container.style.backgroundImage = 'url("' + tile.src  + '")'          
            
            text.innerHTML = tile.tile_name

            map_container.appendChild(text)
            map_layer_tiles_list.appendChild(map_container)

            if(onTiles() == tile.tile_name){
                console.log('on tile:', onTiles());
                
            }
        })

    })
    

    return <>
        <nav class="side-map-menu min-w-[40px]">
            <svg ref={ref_side_menu_toggler_btn} id="map-settings" class="cursor-pointer" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.875 22H10.125C9.87497 22 9.6583 21.9167 9.47497 21.75C9.29164 21.5833 9.1833 21.375 9.14997 21.125L8.84997 18.8C8.6333 18.7167 8.42897 18.6167 8.23697 18.5C8.04497 18.3833 7.85764 18.2583 7.67497 18.125L5.49997 19.025C5.26664 19.1083 5.0333 19.1167 4.79997 19.05C4.56664 18.9833 4.3833 18.8417 4.24997 18.625L2.39997 15.4C2.26664 15.1833 2.22497 14.95 2.27497 14.7C2.32497 14.45 2.44997 14.25 2.64997 14.1L4.52497 12.675C4.5083 12.5583 4.49997 12.4457 4.49997 12.337V11.663C4.49997 11.5543 4.5083 11.4417 4.52497 11.325L2.64997 9.9C2.44997 9.75 2.32497 9.55 2.27497 9.3C2.22497 9.05 2.26664 8.81667 2.39997 8.6L4.24997 5.375C4.36664 5.14167 4.54564 4.99567 4.78697 4.937C5.0283 4.87833 5.26597 4.891 5.49997 4.975L7.67497 5.875C7.8583 5.74167 8.04997 5.61667 8.24997 5.5C8.44997 5.38333 8.64997 5.28333 8.84997 5.2L9.14997 2.875C9.1833 2.625 9.29164 2.41667 9.47497 2.25C9.6583 2.08333 9.87497 2 10.125 2H13.875C14.125 2 14.3416 2.08333 14.525 2.25C14.7083 2.41667 14.8166 2.625 14.85 2.875L15.15 5.2C15.3666 5.28333 15.571 5.38333 15.763 5.5C15.955 5.61667 16.1423 5.74167 16.325 5.875L18.5 4.975C18.7333 4.89167 18.9666 4.88333 19.2 4.95C19.4333 5.01667 19.6166 5.15833 19.75 5.375L21.6 8.6C21.7333 8.81667 21.775 9.05 21.725 9.3C21.675 9.55 21.55 9.75 21.35 9.9L19.475 11.325C19.4916 11.4417 19.5 11.5543 19.5 11.663V12.337C19.5 12.4457 19.4833 12.5583 19.45 12.675L21.325 14.1C21.525 14.25 21.65 14.45 21.7 14.7C21.75 14.95 21.7083 15.1833 21.575 15.4L19.725 18.6C19.5916 18.8167 19.404 18.9627 19.162 19.038C18.92 19.1133 18.6826 19.109 18.45 19.025L16.325 18.125C16.1416 18.2583 15.95 18.3833 15.75 18.5C15.55 18.6167 15.35 18.7167 15.15 18.8L14.85 21.125C14.8166 21.375 14.7083 21.5833 14.525 21.75C14.3416 21.9167 14.125 22 13.875 22ZM12.05 15.5C13.0166 15.5 13.8416 15.1583 14.525 14.475C15.2083 13.7917 15.55 12.9667 15.55 12C15.55 11.0333 15.2083 10.2083 14.525 9.525C13.8416 8.84167 13.0166 8.5 12.05 8.5C11.0666 8.5 10.2373 8.84167 9.56197 9.525C8.88664 10.2083 8.5493 11.0333 8.54997 12C8.54997 12.9667 8.8873 13.7917 9.56197 14.475C10.2366 15.1583 11.066 15.5 12.05 15.5Z" fill="white"/>
            </svg>
        </nav>

        <section ref={side_menu_toggler} id="side-map-toggler">
            <header class="flex">
                Réglages du fond de carte

                <div class="menu__toggler active" ref={ref_side_menu_close_toggler_btn}>
                    <div> 
                        <span></span> 
                    </div>
                </div>
            </header>

            <section id="map-layer-tiles-list" ref={map_layer_tiles_list}>
                
            </section>
        </section>
    </>
}
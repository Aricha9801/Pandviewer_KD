import L from "leaflet";
import MarkerGold from "../assets/GoldMarker.png";
import MarkerShadow from "../assets/marker-shadow.png";

/**
 * Dit is de goude leaflet icoon
 */
export const Icons = new L.Icon.Default({
  iconUrl: MarkerGold,
  iconRetinaUrl: MarkerGold,
  imagePath: " ",
  shadowUrl: MarkerShadow,
  className: "goldMarker"
});

/**
 * Dit is de default leaflet icoon
 */
export const DefaultIcon = new L.Icon.Default();

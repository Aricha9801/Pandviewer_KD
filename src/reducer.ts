import React from "react";
import * as immer from "immer";

export interface State {
  clickedLayer: { x: number, y: number, values: Array<SingleObject> }
  coordinateQuery: CoordinateQuery;
  textSearchQuery: TextQuery; //add new state
  isFetching: boolean; // Fetching results from API
  mapClustered: boolean;
  searchResults: Array<SingleObject>;
  selectedObject: SingleObject;
  zoomLevel: number;
}
export const initialState: State = {
  clickedLayer: undefined,
  coordinateQuery: undefined,
  textSearchQuery: undefined,
  isFetching: false,
  mapClustered: true,
  searchResults: [],
  selectedObject: undefined,
  zoomLevel: 8, //default leaflet zoom level
};

export type Action =
  | { type: "clickLayer", value: { x: number, y: number, values: Array<SingleObject> } }
  | { type: "closeClickedLayer" }
  | { type: "coordinate_search_error" }
  | { type: "coordinate_search_start"; value: CoordinateQuery }
  | { type: "coordinate_search_success"; results: State["searchResults"] }
  | { type: "reset" }
  | { type: "resetSelectedObject" }
  | { type: "search_error" } //text search error
  | { type: "search_start"; value: TextQuery } //text search start
  | { type: "search_success"; results: State["searchResults"] } //text search start
  | { type: "selectObject"; value: SingleObject }
  | { type: "setMapClustered"; value: boolean }
  | { type: "zoomChange"; value: number }

//Single element
export interface SingleObject {
  bag: string;
  bagShape: any;
  address: string;
  bouwjaar: string;
  status: string;
  brt: string;
  brtName: string;
  brtTypeName: string;
  bgt: string;
  bgtStatus: string
}


export interface CoordinateQuery {
  lat: string;
  lng: string;
}

export interface TextQuery {
  postcode: string;
  houseNumber: string;
}
export const reducer: React.Reducer<State, Action> = immer.produce((state: State, action: Action) => {
  console.log("%c " + action.type, "color: #ff00e6");
  switch (action.type) {
    //coordinate search module
    case "coordinate_search_start":
      state.isFetching = true;
      state.coordinateQuery = action.value;
      state.searchResults = [];
      state.selectedObject = undefined;
      return state;
    case "coordinate_search_error":
      state.isFetching = false;
      return state;
    case "coordinate_search_success":
      state.isFetching = false;
      state.searchResults = action.results;
      return state;
    
    //text search module
    case "search_start":
      state.isFetching = true;
      state.textSearchQuery = action.value;
      state.searchResults = [];
      state.selectedObject = undefined;
      return state;
    case "search_error":
      state.isFetching = false;
      return state;
    case "search_success":
      state.isFetching = false;
      state.searchResults = action.results;
      return state;

    case "reset":
      return initialState;
    case "setMapClustered":
      state.mapClustered = action.value;
      return state;
    case "selectObject":
      state.selectedObject = action.value;
      state.clickedLayer = undefined; //might be selected from layer popup
      return state;
    case "resetSelectedObject":
      state.selectedObject = undefined;
      return state;
    case "clickLayer":
      state.clickedLayer = action.value;
      return state;
    case "closeClickedLayer":
      state.clickedLayer = undefined
      return state;
    case "zoomChange":
      state.zoomLevel = action.value;
      if (state.zoomLevel < 10 && !state.mapClustered) state.mapClustered = true;
      if (state.zoomLevel >= 10 && state.mapClustered) state.mapClustered = false;
      console.log("zoomlevel = " + state.zoomLevel)
      return state;
    default:
      return state;
  }
});

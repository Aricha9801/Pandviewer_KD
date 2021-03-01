import * as wellKnown from "wellknown";
import _ from "lodash";
import {getDataByQuery, sparqlApi} from "../Query";
import {SingleObject} from "../reducer";
export interface SparqlResults {
    head: Head;
    results: {
        bindings: Binding[];
    };
}
export interface Head {
    vars: string[];
}
export interface Binding {
    [varname: string]: BindingValue;
}
export type BindingValue =
    | {
    type: "uri";
    value: string;
}
    | {
    type: "literal";
    value: string;
    "xml:lang"?: string;
    datatype?: string;
}
    | { type: "bnode"; value: string };



/**
 * Zet de sparql json resulaten om in een Resultaat.js array
 * @param results
 */
export async function queryResourcesDescriptions(lat: string, lng: string, iris: string[]) : Promise<SingleObject[]>{
    let res = await queryTriply(getDataByQuery(lat, lng, ));

    //The sparql results for 1 iri may span multiple rows. So, group them
    const groupedByIri = _.groupBy(res.results.bindings, b => b.registratie.value); //s is the iri variable name
    return iris
        .map(iri => {
            const bindings = groupedByIri[iri];
            if (!bindings) return undefined;
            const firstBinding = bindings[0];
            let geoJson: any;
            if (firstBinding.shape) {
                let wktJson = bindings[0].shape.value;
                geoJson = wellKnown.parse(wktJson);
            }
            return {
                registratie: iri,
                shapeTooltip: firstBinding.shapeTooltip.value,
                types: _.uniq(bindings.map(b => b.type.value)),
                shape: geoJson,
                shapeColor: bindings.filter(b => !!b.shapeColor?.value)[0]?.shapeColor?.value
            };
        })
        .filter(i => !!i);
}


/**
 * Dit is een methode die het sparql endpoint van triply queriet.
 * @param query string met query
 * @returns {Promise<Response>}
 */
export async function queryTriply(query: string): Promise<SparqlResults> {
  const result = await fetch(sparqlApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/sparql-query",
      Accept: "application/sparql-results+json"
    },
    body: query
  });

  if (result.status > 300) {
    throw new Error("Request with response " + result.status);
  }

  return JSON.parse(await result.text());
}

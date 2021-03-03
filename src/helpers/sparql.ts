import * as wellKnown from "wellknown";
import _ from "lodash";
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
 * Convert the sparql json results into a Result.js array
 * @param results
 */
export async function queryResourcesDescriptions(lat: string, lng: string, iris: string[]) : Promise<SingleObject[]>{
    let res = await runQuery(lat,lng,'100.0');

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
 * 
 * @param lat 
 * @param long 
 * @param precisie 
 */
export async function runQuery(lat: string, long: string, precisie: string): Promise<SparqlResults> {
    const sparqlApi = 'https://api.labs.kadaster.nl/queries/kadaster/bgt-ld-maps/run';
    let sufUrl='?lat='+lat+'&long='+long+'&precisie='+precisie+'&page=1&pageSize=100';
    let runApi=sparqlApi+sufUrl;
    const result = await fetch(runApi, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/sparql-results+json"
        },
           
    });
    if (result.status > 300) {
        throw new Error("Request with response " + result.status);
    }

    return JSON.parse(await result.text());

}
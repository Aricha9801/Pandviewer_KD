import * as wellKnown from "wellknown";
import _ from "lodash";
import { SingleObject } from "../reducer";

//Sparql query api
const coordSearchApi = 'https://api.labs.kadaster.nl/queries/jiarong-li/PandviewerTest/run'; //The coordinate search APi
const textSearchApi = 'https://api.labs.kadaster.nl/queries/jiarong-li/PandviewerSearch/run'; //The text search api
//Declaration of strtucture of the result
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
        type: "typed-literal";
        value: string;
    }
    | {
        type: number; 
        value: string
    }
    | {
        type: "typed-literal"; 
        value: string
    }
    | {
        type: "literal"; 
        value: string
    }
    | {
        type: "url"; 
        value: string
    }
    | {
        type: "literal"; 
        value: string
    }
    | {
        type: "literal"; 
        value: string
    }
    | {
        type: "url"; 
        value: string
    }
    | {
        type: "literal"; 
        value: string
    };


/**
 * Convert the sparql json results of the coordinate query into a Result.js array
 *  Convert the geometry format from wkt to geoJson.
 */
export async function queryResourcesDescriptions(lat: string, lng: string, iris: string[]): Promise<SingleObject[]> {
    let res = await runQuery(lat, lng);

    //The sparql results for 1 iri may span multiple rows. So, group them
    const groupedByIri = _.groupBy(res.results.bindings, b => b.bag.value); //s is the iri variable name
    return iris
        .map(iri => {
            const bindings = groupedByIri[iri];
            if (!bindings) return undefined;
            const firstBinding = bindings[0];
            let geoJson: any;
            // In this case there is only one record of the result, so it uses 'firstBinding'. In other case it should be modified.
            if (firstBinding.bagShape) {
                let wktJson = bindings[0].bagShape.value;
                geoJson = wellKnown.parse(wktJson);
            }
            return {
                bag: iri,
                bagShape: geoJson,
                address: firstBinding.address.value,
                bouwjaar: firstBinding.bouwjaar.value,
                status: firstBinding.status.value,
                brt: firstBinding.brt.value,
                brtName: firstBinding.brtName.value,
                brtTypeName: firstBinding.brtTypeName.value,
                bgt: firstBinding.bgt.value,
                bgtStatus: firstBinding.bgtStatus.value
            };
        })
        .filter(i => !!i);
}

/**
 * Convert the sparql json results of the text search into a Result.js array
 */
export async function searchResourcesDescriptions(postcode: string, housenumber: string, iris: string[]): Promise<SingleObject[]> {
    let res = await searchQuery(postcode, housenumber);

    //The sparql results for 1 iri may span multiple rows. So, group them
    const groupedByIri = _.groupBy(res.results.bindings, b => b.bag.value); //s is the iri variable name
    return iris
        .map(iri => {
            const bindings = groupedByIri[iri];
            if (!bindings) return undefined;
            const firstBinding = bindings[0];
            let geoJson: any;

            if (firstBinding.bagShape) {
                let wktJson = bindings[0].bagShape.value;
                geoJson = wellKnown.parse(wktJson);
            }
            return {
                bag: iri,
                bagShape: geoJson,
                address: firstBinding.address.value,
                bouwjaar: firstBinding.bouwjaar.value,
                status: firstBinding.status.value,
                brt: firstBinding.brt.value,
                brtName: firstBinding.brtName.value,
                brtTypeName: firstBinding.brtTypeName.value,
                bgt: firstBinding.bgt.value,
                bgtStatus: firstBinding.bgtStatus.value
            };
        })
        .filter(i => !!i);
}

/**
 * Get the coordinate query result from the api
 * @param lat 
 * @param long 
 */
export async function runQuery(lat: string, long: string): Promise<SparqlResults> {
    let sufUrl = '?lat=' + lat + '&long=' + long; //The appendix with parameters
    let runApi = coordSearchApi + sufUrl;
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

/**
 * Get the text search result from the api
 * @param postcode 
 * @param housenumber 
 * @returns 
 */
export async function searchQuery(postcode: string, housenumber: string): Promise<SparqlResults> {
    let sufUrl = '?postcode=' + postcode + '&huisnummer=' + housenumber;
    let runApi = textSearchApi + sufUrl;
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
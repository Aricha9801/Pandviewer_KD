import { queryTriply, queryResourcesDescriptions } from "./sparql";
import { getDataByQuery} from "../Query";

export async function getFromCoordinates(lat : string, lng: string) {

  const results = await queryTriply(getDataByQuery(lat, lng));

  return await queryResourcesDescriptions(lat, lng, results.results.bindings.map(b => b.registratie.value));
}

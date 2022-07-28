import { sendRequest } from "./APIHelper";

const ipLookupAPI = 'https://extreme-ip-lookup.com/json/?key=hsA5j5AAWFkKE4VLTLDZ';

/**
 * Returns object represent current location country informations.
 */
export async function getLocalCountryInfo() {
    const results = await sendRequest({ url: ipLookupAPI });
    return results.data;
}
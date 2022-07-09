import { sendRequest } from "./APIHelper";

const ipLookupAPI = 'https://extreme-ip-lookup.com/json/?key=hsA5j5AAWFkKE4VLTLDZ';

export async function getLocalCountryInfo(){
    const results = await sendRequest({url: ipLookupAPI});
    return results.data;
}
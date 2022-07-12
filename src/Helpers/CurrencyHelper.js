import { getAllInfoByISO } from "iso-country-currency";
import { sendRequest } from "./APIHelper";

const exchangerateApi =
  "https://v6.exchangerate-api.com/v6/937daa363ed1edd7e0ce5b38/latest/";

export async function getCurrencyRateByCode(currencyCode) {
  const result = await sendRequest({ url: exchangerateApi + currencyCode });
  return result.data;
}

export function convertNumberToCurrency(countryCode, inputString) {
  inputString = inputString.replace(/,/g, "");
  return parseFloat(inputString).toLocaleString(countryCode, {
    style: "decimal"
  });
}


export function getCurrencyInfoByCode(countryCode){
    return getAllInfoByISO(countryCode);
}


import {
  getAllInfoByISO,
  getAllISOByCurrencyOrSymbol,
  getAllISOCodes,
  getParamByParam,
} from "iso-country-currency";
import { sendRequest } from "./APIHelper";
import { getItem, setItem } from "./LocalStorageHelper";

const localStorageKey = "v6-exchangerate";

const exchangerateApi =
  "https://v6.exchangerate-api.com/v6/b87d2f894975afeee4f84058/latest/";


/**
 * Get currencies exchange rates from local storages
 * Returns the list of exchange rates, otherwise return null
 * @param {string} currencyCode - base currency.
 */
const getCurrenciesFromLocalStorage = (currencyCode) => {
  const currDate = new Date().toDateString();
  const rateList = getItem(localStorageKey);

  if (!currencyCode || !rateList || !rateList.date || rateList.date !== currDate) return;

  const rates = rateList.rates.filter((rate) => rate.currencyCode === currencyCode);

  if (rates.length === 0) return;

  return rates;
};

/**
 * Set currencies exchange rates to local storages 
 * @param {string} currencyCode - base currency.
 * @param {list} data - list exchange rates based on currencyCode.
 */
const setCurrenciesFromLocalStorage = (currencyCode, data) => {
  const currDate = new Date().toDateString();
  let rateList = getItem(localStorageKey);

  // if rates list have not existed or a new day has start => reset local storage
  if (!rateList || !rateList.date || rateList.date !== currDate) {
    let newRateList = {
      date: currDate,
      rates: [{ currencyCode: currencyCode, rates: data }],
    };

    setItem(localStorageKey, newRateList);
    return;
  }

  // check if based on currency rate list exist 
  const rates = getCurrenciesFromLocalStorage(currencyCode);

  // if not exist
  if (!rates || rates.length === 0) {
    rateList.rates.push({ currencyCode: currencyCode, rates: data });
    setItem(localStorageKey, rateList);
  }
};

/**
 * Get currency exchange rates by currency code. 
 * returns exchange rates from api or local storage, otherwise return null
 * @param {string} currencyCode - base currency.
 */
export async function getCurrencyRateByCode(currencyCode) {
  // if exchange rates exist in local storage
  let rates = getCurrenciesFromLocalStorage(currencyCode);
  if (rates && rates.length !== 0) return rates[0].rates;

  // if not, start request api to v6.exchangerate-api.com
  const result = await sendRequest({ url: exchangerateApi + currencyCode });

  if (!result || !result.data) return

  setCurrenciesFromLocalStorage(currencyCode, result.data.conversion_rates);

  return result.data.conversion_rates;
}

/**
 * Convert number to curency 
 * Returns converted money, otherwise return null
 * @param {string} currency - base currency code.
 * @param {list} inputString - input number
 */
export function convertNumberToCurrency(currency, inputString) {
  if (!currency || (!inputString && Number(inputString) !== 0)) return;

  let iso = getAllISOByCurrencyOrSymbol("currency", currency);
  if (!iso || iso.length === 0) return;

  inputString = inputString.toString().replace(",", "");
  iso = iso[0];

  return new Intl.NumberFormat(iso, {
    style: "currency",
    currency,
    currencyDisplay: "code",
  })
    .format(inputString)
    .replace(currency, "")
    .trim();
}

/**
 * Get currency informations by country code 
 * Return list of currency information (symbol,...) base on country code
 * @param {string} countryCode - country code.
 */
export function getCurrencyInfoByCountryCode(countryCode) {
  if (!countryCode) return;

  return getAllInfoByISO(countryCode);
}

/**
 * Get All Curency informations  
 */
export const getAllCurrenciesInfo = () => getAllISOCodes();

/**
 * Get currency symbol by currency code  
 * Returns currency symbol, otherwise return null
 * @param {string} currencyCode - currency Code.
 */
export const getSymbolByCurrency = (currencyCode) => {
  if (!currencyCode) return;
  return getParamByParam("currency", currencyCode, "symbol");
}

/**
 * Reverse currency back to number 
 * @param {string} currency value - currency value.
 */
export const convertCurrencyToNumber = (currency) =>
  Number(currency.replace(/[^0-9.-]+/g, ""));

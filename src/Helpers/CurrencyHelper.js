import {
  getAllInfoByISO,
  getAllISOByCurrencyOrSymbol,
  getAllISOCodes,
  getParamByParam,
} from "iso-country-currency";
import { sendRequest } from "./APIHelper";
import { getItem, setItem } from "./LocalStorageHelper";

const localStorageKey = "v6-exchangerate";

export const currencyParams = {
  ios: "",
  countryName: "",
  currency: "",
  symbol: "",
  dateFormat: "",
};

const exchangerateApi =
  "https://v6.exchangerate-api.com/v6/b87d2f894975afeee4f84058/latest/";

const getCurrenciesFromLocalStorage = (currencyCode) => {
  const currDate = new Date().toDateString();
  const rateList = getItem(localStorageKey);

  if (!rateList) return;

  if (!rateList.date || rateList.date !== currDate) return;

  return rateList.rates.filter((rate) => rate.currencyCode === currencyCode);
};

const setCurrenciesFromLocalStorage = (currencyCode, data) => {
  const currDate = new Date().toDateString();
  let rateList = getItem(localStorageKey);
  
  if (!rateList || !rateList.date || rateList.date !== currDate) {
    let newRateList = {
      date: currDate,
      rates: [{ currencyCode: currencyCode, rates: data }],
    };

    setItem(localStorageKey, newRateList);
    return;
  }

  const rates = getCurrenciesFromLocalStorage(currencyCode);

  if(!rates || rates.length === 0){
    rateList.rates.push({ currencyCode: currencyCode, rates: data });
    setItem(localStorageKey, rateList);
  }
};

export async function getCurrencyRateByCode(currencyCode) {
  let rates = getCurrenciesFromLocalStorage(currencyCode);
  if (rates && rates.length !== 0) return rates[0].rates;

  const result = await sendRequest({ url: exchangerateApi + currencyCode });
  setCurrenciesFromLocalStorage(currencyCode, result.data.conversion_rates);

  return result.data.conversion_rates;
}

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

export function getCurrencyInfoByCode(countryCode) {
  return getAllInfoByISO(countryCode);
}

export const getAllCurrenciesInfo = () => getAllISOCodes();

export const getSymbolByCurrency = (code) =>
  getParamByParam("currency", code, "symbol");

export const convertCurrencyToNumber = (currency) =>
  Number(currency.replace(/[^0-9.-]+/g, ""));

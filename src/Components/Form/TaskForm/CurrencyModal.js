import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Modal } from "react-bootstrap";
import {
  convertNumberToCurrency,
  getCurrencyRateByCode,
  getSymbolByCurrency,
} from "../../../Helpers/CurrencyHelper";
import { isEmptyOrSpaces } from "../../../Helpers/StringHelper";
import { CustomButton } from "../../CommonComponents/Button/Button";
import { useHomeController } from "../../HomeContext";

/**
 * Custom React-Bootstrap modal component. Use when display currency category modal.
 * Support two option : - change select currency
 *                      - exhange current amount based on select rate.
 * Returns open, close, modal component.
 */
export function useCurrencyModal() {
  // #region State
  const [show, setShow] = useState(false);
  // #endregion State

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const CurrencyModal = ({
    amountRef,
    setSelectedTask,
    selectedTask,
    callback,
    ...rest
  }) => {
    // #region State
    const [currencyRates, setCurrencyRates] = useState();
    const [filterCurrencyRates, setFilterCurrencyRates] = useState();
    const { countriesCurrencyInfo, handleErrorShow, setErrorModalContent } = useHomeController();
    const [selectedRow, setSelectedRow] = useState({
      currency: null,
      rate: null,
      amount: null,
    });
    // #endregion State

    // #region Function

    /**
     * Handle auto-search currency and exchange rate.
     * Change filterCurrencyRates list value.
     * @param {object} event - triggered search box element.
     */
    const handleCurrencySearch = (event) => {
      let searchString = event.target.value;

      // if string is empty => return origin rates
      if (isEmptyOrSpaces(searchString)) {
        setFilterCurrencyRates(currencyRates);
        return;
      }

      setTimeout(() => {
        // get iso code by input string
        let isoList = handleSearchByCountriesInfor(searchString);
        let filters = currencyRates.filter((item) =>
          isoList.includes(item.name)
        );
        setFilterCurrencyRates(filters);
      }, 100);
    };

    // Search iso code base on input string
    const handleSearchByCountriesInfor = (searchString) => {
      let currencyResults = [];

      if (countriesCurrencyInfo) {
        searchString = searchString.toLowerCase();

        // Search input string base on iso code, currency code and country name
        countriesCurrencyInfo.forEach((info) => {
          if (
            info.iso.toLowerCase().includes(searchString) ||
            info.currency.toLowerCase().includes(searchString) ||
            info.countryName.toLowerCase().includes(searchString)
          )
            currencyResults.push(info.currency);
        });
      }

      // Incase multi country has same currency code
      currencyResults = currencyResults.filter(
        (element, index) => currencyResults.indexOf(element) == index
      );

      return currencyResults;
    };

    /**
     * Handle select currency in displayed currencies table event.
     * Change selectedRow value(currency, rate, amount).
     * @param {object} currency - selected currency (name: currency name, value: exchange rate).
     */
    const handleSelectCurrencyRow = (currency) => {
      let exchangedAmount =
        parseFloat(selectedTask.amount) * parseFloat(currency.value);
      setSelectedRow((state, props) => ({
        ...state,
        currency: currency.name,
        rate: currency.value,
        amount: exchangedAmount,
      }));
    };

    /**
     * Handle exchange amount submit.
     * Change selectedTask value (ammount, currency).
     */
    const handleExchangeSubmit = () => {
      setSelectedTask((state, prop) => {
        return {
          ...state,
          amount: selectedRow.amount,
          currency: selectedRow.currency,
        };
      });

      amountRef.current.value = convertNumberToCurrency(
        selectedRow.currency,
        selectedRow.amount
      );
      handleClose();
    };

    /**
     * Handle change selected currency submit.
     * Change selectedTask value (currency).
     */
    const handleSelectSubmit = () => {
      setSelectedTask((state, prop) => {
        return { ...state, currency: selectedRow.currency };
      });

      handleClose();
    };

    /**
     * Init selectedRow, currencyRates, filterCurrencyRates value.
     */
    useEffect(() => {
      if (
        !selectedRow.currency ||
        (!selectedRow.amount &&
          selectedRow.amount !== 0 &&
          selectedTask.currency)
      ) {
        // Init Selected Row values
        setSelectedRow((state, props) => {
          return {
            ...state,
            currency: selectedTask.currency,
            rate: 1,
            amount: selectedTask.amount,
          };
        });

        // Init exchange rates
        getCurrencyRateByCode(selectedTask.currency).then((data) => {
          let currencies = [];

          if (data)
            Object.keys(data).forEach((key) => {
              currencies.push({
                name: key,
                value: data[key],
              });
            });

          setCurrencyRates(currencies);
          setFilterCurrencyRates(currencies);
        });
      }
    }, [selectedTask]);

    // #endregion Function

    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered={true}
        fullscreen={true}
        size={"lg"}
        className={"default-mode"}
      >
        <Modal.Header closeButton>
          <Modal.Title>Currencies Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              <strong>Selected Currency:</strong>{" "}
              {selectedRow && selectedRow.currency && selectedRow.currency}
            </p>
            <div className="task-form__currency-exchange">
              <p>
                <strong>Amount:</strong>{" "}
                {convertNumberToCurrency(
                  selectedTask.currency,
                  selectedTask.amount
                )}
              </p>
              {selectedRow.currency !== selectedTask.currency && (
                <>
                  <i className="fas fa-arrow-right"></i>
                  <p>
                    {convertNumberToCurrency(
                      selectedRow.currency,
                      selectedRow.amount
                    )}
                  </p>
                </>
              )}
            </div>
            <input
              type="text"
              className="form-control task-form_currency-search"
              id="task-form_currency-search"
              onChange={handleCurrencySearch}
              placeholder="name, code, iso"
            />
            <div className="task-form__currency-table-warapper">
              <table className="table task-form__currency-table">
                <tbody>
                  {filterCurrencyRates &&
                    filterCurrencyRates.map((currency) => (
                      <tr
                        onClick={() => handleSelectCurrencyRow(currency)}
                        key={currency.name}
                        className={
                          currency.name === selectedRow.currency
                            ? "currency--active"
                            : ""
                        }
                      >
                        <td>{currency.name}</td>
                        <td className="text-end">{currency.value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="task-form__curency-submits">
            <CustomButton
              callback={handleExchangeSubmit}
              disabled={selectedRow.currency === selectedTask.currency}
            >
              Exchange
            </CustomButton>
            <CustomButton
              callback={handleSelectSubmit}
              disabled={selectedRow.currency === selectedTask.currency}
            >
              Select
            </CustomButton>
          </div>
        </Modal.Footer>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    CurrencyModal,
  };
}

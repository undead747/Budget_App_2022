import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Modal } from "react-bootstrap";
import { convertNumberToCurrency, getCurrencyRateByCode, getSymbolByCurrency } from "../../../Helpers/CurrencyHelper";
import { isEmptyOrSpaces } from "../../../Helpers/StringHelper";
import { CustomButton } from "../../CommonComponents/Button/Button";
import { useHomeController } from "../../HomeContext";

export function useCurrencyModal() {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const CurrencyModal = ({
    amountRef,
    setSelectedTask,
    selectedTask,
    callback,
    ...rest
  }) => {
    const [currencyRates, setCurrencyRates] = useState();
    const [filterCurrencyRates, setFilterCurrencyRates] = useState();
    const { countriesCurrencyInfo, setLoading } = useHomeController();
    const [selectedRow, setSelectedRow] = useState({
      currency: null,
      rate: null,
      amount: null
    });

    const handleCurrencySearch = (event) => {
      let searchString = event.target.value;

      if (isEmptyOrSpaces(searchString)) {
        setFilterCurrencyRates(currencyRates);
        return;
      }

      setTimeout(() => {
        let isoList = handleSearchByCountriesInfor(searchString);
        let filters = currencyRates.filter((item) =>
          isoList.includes(item.name)
        );
        setFilterCurrencyRates(filters);
      }, 100);
    };

    const handleSearchByCountriesInfor = (searchString) => {
      let currencyResults = [];

      if (countriesCurrencyInfo) {
        searchString = searchString.toLowerCase();
        countriesCurrencyInfo.forEach((info) => {
          if (
            info.iso.toLowerCase().includes(searchString) ||
            info.currency.toLowerCase().includes(searchString) ||
            info.countryName.toLowerCase().includes(searchString)
          )
            currencyResults.push(info.currency);
        });
      }

      currencyResults = currencyResults.filter(
        (element, index) => currencyResults.indexOf(element) == index
      );

      return currencyResults;
    };

    const handleSelectCurrencyRow = (currency) => {
      let exchangedAmount = selectedTask.amount * currency.value;
      setSelectedRow((state, props) => ({ ...state, currency: currency.name, rate: currency.value, amount: exchangedAmount }));
    }

    const handleExchangeSubmit = () => {
      setSelectedTask((state, prop) => {
        return { ...state, amount: selectedRow.amount, currency: selectedRow.currency }
      })

      amountRef.current.value = convertNumberToCurrency(selectedRow.currency, selectedRow.amount);
      handleClose();
    };

    const handleSelectSubmit = () => {
      setSelectedTask((state, prop) => {
        return { ...state, currency: selectedRow.currency }
      })

      handleClose();
    }

    useEffect(() => {
      if (!selectedRow.currency || !selectedRow.amount && selectedRow.amount !== 0) {
        if (selectedTask.currency) {
          setSelectedRow((state, props) => {
            return { ...state, currency: selectedTask.currency, rate: 1 }
          });

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

          setSelectedRow((state, props) => {
            return { ...state, amount: selectedTask.amount }
          });
        }
      }
    }, [selectedTask]);

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
            <p><strong>Selected Currency:</strong> {selectedRow && selectedRow.currency && selectedRow.currency}</p>
            <div className="task-form__currency-exchange">
              <p><strong>Amount:</strong> {convertNumberToCurrency(selectedTask.currency, selectedTask.amount)} {selectedTask.currency && getSymbolByCurrency(selectedTask.currency)}</p>
              {
                (selectedRow.currency !== selectedTask.currency) && <>
                  <i className="fas fa-arrow-right"></i>
                  <p>{convertNumberToCurrency(selectedRow.currency, selectedRow.amount)} {selectedRow && selectedRow.currency && getSymbolByCurrency(selectedRow.currency)}</p>
                </>
              }
            </div>
            <input type="text"
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
            <CustomButton callback={handleExchangeSubmit} disabled={(selectedRow.currency === selectedTask.currency)}>Exchange</CustomButton>
            <CustomButton callback={handleSelectSubmit} disabled={(selectedRow.currency === selectedTask.currency)}>Select</CustomButton>
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

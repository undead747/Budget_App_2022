import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { getCurrencyRateByCode } from "../../../Helpers/CurrencyHelper";
import { isEmptyOrSpaces } from "../../../Helpers/StringHelper";
import { CustomButton } from "../../CommonComponents/Button/Button";
import { useHomeController } from "../../HomeContext";

export function useCurrencyModal() {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const CurrencyModal = ({ selectedCurrency, callback, ...rest }) => {
    const [currencyRates, setCurrencyRates] = useState();
    const [filterCurrencyRates, setFilterCurrencyRates] = useState();
    const { countriesCurrencyInfo, setLoading } = useHomeController();
    const [selectedRow, setSelectedRow] = useState();

    const handleCurrencySearch = (event) => {
      let searchString = event.target.value;

      if (isEmptyOrSpaces(searchString)) {
        setFilterCurrencyRates(currencyRates);
        return
      }

      setTimeout(() => {
        let isoList = handleSearchByCountriesInfor(searchString);
        let filters = currencyRates.filter(item => isoList.includes(item.name));
        setFilterCurrencyRates(filters);
      }, 100)
    }

    const handleSearchByCountriesInfor = (searchString) => {
      let currencyResults = [];

      if (countriesCurrencyInfo) {
        searchString = searchString.toLowerCase();
        countriesCurrencyInfo.forEach(info => {
          if (info.iso.toLowerCase().includes(searchString) ||
            info.currency.toLowerCase().includes(searchString) ||
            info.countryName.toLowerCase().includes(searchString)) currencyResults.push(info.currency);
        })
      }

      currencyResults = currencyResults.filter((element, index) => currencyResults.indexOf(element) == index);

      return currencyResults;
    }

    const handleSelectCurrencyRow = (currency) => setSelectedRow(currency.name);

    const handleSubmit = () => {
    };

    useEffect(() => {
      if (selectedCurrency) {
        setSelectedRow(selectedCurrency);

        getCurrencyRateByCode(selectedCurrency).then(data => {
          let currencies = [];

          if (data && data.conversion_rates) Object.keys(data.conversion_rates).forEach(key => {
            currencies.push({
              name: key,
              value: data.conversion_rates[key]
            })
          })

          setCurrencyRates(currencies);
          setFilterCurrencyRates(currencies);
        })
      }
    }, [selectedCurrency])

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
            <p>Selected Currency: {selectedRow}</p>
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
                          currency.name === selectedRow
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
            <CustomButton>Exchange</CustomButton>
            <CustomButton>Select</CustomButton>
          </div>
        </Modal.Footer>
      </Modal>
    );
  };

  return {
    handleShow,
    handleClose,
    CurrencyModal
  }
}

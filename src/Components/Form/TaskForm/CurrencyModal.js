import React, { useEffect } from "react";
import { isEmptyOrSpaces } from "../../../Helpers/StringHelper";

function CurrencyModal({
  selectedCurrency,
  setSelectedCurrency,
  handleClose,
  setIModalStates,
  ...rest
}) {
//   const currencies = null;

//   useEffect(() => {
//     if(selectedCurrency) console.log(selectedCurrency)
//   }, [selectedCurrency]);

//   const handleCurrencySearch = (event) => {
//     let searchStr = event.target.value;

//     if (isEmptyOrSpaces(searchStr)) {
//       setFilterCurrencies(currencies);
//       return;
//     }
//   };

//   let modalContent = (
//     <div>
//       <input
//         type="text"
//         className="form-control task-form_currency-search"
//         id="task-form_currency-search"
//         onChange={handleCurrencySearch}
//         placeholder="currency code"
//       />
//       <div className="task-form__currency-table-warapper">
//         <table className="table task-form__currency-table">
//           <tbody>
//             {filteredCurrencies &&
//               filteredCurrencies.map((currency) => (
//                 <tr
//                   key={currency.name}
//                   className={
//                     currency.name === localCountryInfo.currency
//                       ? "currency--active"
//                       : ""
//                   }
//                 >
//                   <td>{currency.name}</td>
//                   <td className="text-end">{currency.rate}</td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   let modalFooter = (
//     <div className="task-form__curency-submits">
//       <CustomButton>Exchange</CustomButton>
//       <CustomButton>Select</CustomButton>
//     </div>
//   );

//   setIModalStates({
//     content: modalContent,
//     title: "Currency Setting",
//     footer: modalFooter,
//     fullscreen: true,
//   });
}

export default CurrencyModal;

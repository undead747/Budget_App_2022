import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import "./chart.css";
import { dynamicColors } from "../../../Helpers/ColorHelper";
import { getCurrencyRateByCode } from "../../../Helpers/CurrencyHelper";
import { useHomeController } from "../../HomeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

export function TaskChart({ tasks, ...rest }) {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      }
    ]
  });

  // Get loading animantion, alert message, current location information from home-Controller.
  const { localCountryInfo } = useHomeController();

  useEffect(() => {
    contructChartData();
  }, [tasks]);
  
  const contructChartData = async () => {
    if (tasks && localCountryInfo) {
      const groupbyTasks = {};
      const rates = await getCurrencyRateByCode(localCountryInfo.currency);
      
      tasks.forEach(task => {
        let amount = parseFloat(task.amount);
        if (
          task.currency !== localCountryInfo.currency &&
          rates[task.currency]
        ) {
          amount = amount / parseFloat(rates[task.currency]);
        } 

        if(!groupbyTasks[task.taskCate.name]){
          let color = dynamicColors();

          groupbyTasks[task.taskCate.name] = {
            color: color,
            amount: amount
          }
        }else{
          groupbyTasks[task.taskCate.name].amount = groupbyTasks[task.taskCate.name].amount +  amount;
        }
      })

      const labels = [];
      const data = [];
      const colors = [];
      Object.keys(groupbyTasks).forEach(key => {
          labels.push(key);
          data.push(groupbyTasks[key].amount);
          colors.push(groupbyTasks[key].color);
      })

      setData(current => {

        return {
          ...current,
          labels: labels,
          datasets: [{
            ...current.datasets[0],
            data: data,
            backgroundColor: colors,
            borderColor: colors
          }]
        }
      })
    }
  };

  if (tasks && tasks.length > 0)
    return (
      <div className="tasks-chart">
        <Pie data={data} />
      </div>
    );
  else
    return (
      <div className="alert alert-warning" role="alert">
        don't have any data to display
      </div>
    );
}

export function BudgetsChart({ budgets, ...rest }) {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      }
    ]
  });

  useEffect(() => {
    contructChartData();
  }, [budgets]);
  
  const contructChartData = async () => {
    if (budgets) {
      const labels = [];
      const data = [];
      const colors = [];

      budgets.forEach(budget => {
        const amount = parseFloat(budget.amount);
        const color = dynamicColors();

        labels.push(budget.name);
        data.push(amount);
        colors.push(color);
      })

      setData(current => {

        return {
          ...current,
          labels: labels,
          datasets: [{
            ...current.datasets[0],
            data: data,
            backgroundColor: colors,
            borderColor: colors
          }]
        }
      })
    }
  };

  if (budgets && budgets.length > 0)
    return (
      <div className="tasks-chart">
        <Pie data={data} />
      </div>
    );
  else
    return (
      <div className="alert alert-warning" role="alert">
        don't have any data to display
      </div>
    );
}


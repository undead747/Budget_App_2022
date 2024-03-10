// Define budget task mode - effect displayed categories
export const taskModes = {
  Income: { id: 1, name: "Income", param: 'income' },
  Expense: { id: 0, name: "Expense", param: 'expense' },
  Transfer: { id: 2, name: "Transfer inner account", param: 'transferinneraccount' },
};

export const DebtModes = {
  OwedToMe : {id: 0, name: "Owed To Me"},
  OwedByMe: {id: 1, name: "Owed By Me"}
}

export const Tasks = {
  accountCategory: "accountCate",
  amount: "amount",
  createAt: "create_at",
  currency: "currency",
  date: "date",
  formatedDate: "formatedDate",
  note: "note",
  taskCategory: "taskCate",
  title: "title",
};

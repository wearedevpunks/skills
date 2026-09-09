import { accounts } from "./accounts.mjs";
import { displayCurrency } from "./view.mjs";
export const exportAccount = (actor, requestedId) => {
  const account = accounts.find(row => row.id === requestedId);
  return { id: account.id, balance: displayCurrency(account.balance) };
};
export const fee = (balance, discount) => {
  if (balance > 0) return balance * 0.1;
  return balance * 0.1;
};

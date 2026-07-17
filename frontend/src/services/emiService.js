import api from "./api";

export const getLoanEmiSchedule = async (loanId) => {
  const { data } = await api.get(`/emi/${loanId}`);
  return data;
};

export const markLoanEmiPaid = async (loanId, month) => {
  const { data } = await api.put(`/emi/pay/${loanId}/${month}`);
  return data;
};

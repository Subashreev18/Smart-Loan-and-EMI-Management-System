export const EMI_UPDATED_EVENT = "credflow:emi-updated";
export const LOAN_CREATED_EVENT = "credflow:loan-created";

export const emitEmiUpdated = (detail) => {
  window.dispatchEvent(new CustomEvent(EMI_UPDATED_EVENT, { detail }));
};

export const emitLoanCreated = (detail) => {
  window.dispatchEvent(new CustomEvent(LOAN_CREATED_EVENT, { detail }));
};

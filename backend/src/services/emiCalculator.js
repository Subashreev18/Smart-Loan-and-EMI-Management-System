export const calculateEMI = (amount, interestRate, tenure) => {
  const monthlyRate = interestRate / 12 / 100;
  const emi =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);

  return Math.round(emi);
};

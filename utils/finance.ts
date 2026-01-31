
import { CalculationInputs, AmortizationRow, SummaryData } from '../types';

export const calculateAmortization = (inputs: CalculationInputs): { schedule: AmortizationRow[], summary: SummaryData } => {
  const { principal, annualInterestRate, termYears, startDate, extraPayment } = inputs;
  
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = termYears * 12;
  
  const monthlyPayment = monthlyRate > 0 
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    : principal / numberOfPayments;

  let balance = principal;
  const schedule: AmortizationRow[] = [];
  let totalInterest = 0;
  let totalPayment = 0;
  
  const baseDate = new Date(startDate);

  for (let i = 1; i <= numberOfPayments; i++) {
    if (balance <= 0) break;

    const interest = balance * monthlyRate;
    let principalPaid = monthlyPayment - interest;
    
    // Check if we have enough balance for this payment
    if (principalPaid > balance) {
      principalPaid = balance;
    }

    // Apply extra payment
    let actualExtra = extraPayment;
    if (balance - principalPaid < actualExtra) {
      actualExtra = Math.max(0, balance - principalPaid);
    }

    const totalPeriodPayment = principalPaid + interest + actualExtra;
    balance -= (principalPaid + actualExtra);
    
    totalInterest += interest;
    totalPayment += totalPeriodPayment;

    const currentDate = new Date(baseDate);
    currentDate.setMonth(baseDate.getMonth() + i);

    schedule.push({
      period: i,
      date: currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      payment: monthlyPayment,
      principal: principalPaid,
      interest: interest,
      extraPayment: actualExtra,
      totalPayment: totalPeriodPayment,
      balance: Math.max(0, balance)
    });
  }

  const standardTotalInterest = (monthlyPayment * numberOfPayments) - principal;

  return {
    schedule,
    summary: {
      monthlyPayment,
      totalInterest,
      totalPayment,
      payoffDate: schedule[schedule.length - 1]?.date || startDate,
      savingsWithExtra: Math.max(0, standardTotalInterest - totalInterest)
    }
  };
};

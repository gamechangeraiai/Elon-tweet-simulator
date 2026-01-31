
/**
 * Formula from spreadsheet: =sum((((AvgDaily/24)*HourRemaining)+(AvgDaily*DayRemaining))+TotalTweet)
 */
export const calculateForecastRange = (
  avgDaily: number,
  daysLeft: number,
  hoursLeft: number,
  totalTweet: number
): number => {
  if (!avgDaily) return totalTweet;
  return ((avgDaily / 24) * hoursLeft) + (avgDaily * daysLeft) + totalTweet;
};

// Added missing helper to calculate time remaining for forecasting
export const calculateTimeRemaining = (targetDate: string): { days: number; hours: number } => {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (isNaN(target) || diff <= 0) {
    return { days: 0, hours: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return { days, hours };
};

export const calculateRowPnl = (shares: number, cost: number, currentPrice: number): number => {
  if (shares === 0) return 0;
  return (currentPrice * shares) - cost;
};

export const calculateSummaryPort = (rows: { shares: number, cost: number }[], currentPrice: number) => {
  const totalCost = rows.reduce((sum, r) => sum + r.cost, 0);
  const totalUnrealizedPnl = rows.reduce((sum, r) => {
    const pnl = r.shares > 0 ? (currentPrice * r.shares) - r.cost : 0;
    return sum + pnl;
  }, 0);
  
  return {
    cost: totalCost,
    unrealizedPnl: totalUnrealizedPnl,
    total: totalCost + totalUnrealizedPnl
  };
};

export const calculateNetPnl = (sold: number, cost: number): number => {
  return sold - cost;
};

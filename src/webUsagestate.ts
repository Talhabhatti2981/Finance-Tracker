// Data derived from https://gs.statcounter.com/os-market-share/desktop/worldwide/2023
// And https://gs.statcounter.com/os-market-share/mobile/worldwide/2023
// And https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/worldwide/2023
// For the month of December 2023

export const desktopOS = [
  {
    label: 'Income',
    value: 50000,
  },
  {
    label: 'Expense',
    value: 55000,
  },
  
  {
    label: 'Fuel',
    value:25000,
  },
  {
    label: 'Groceries',
    value: 30000,
  },
  {
    label: 'Bike Maintance',
    value: 20000,
  },
  {
    label: 'House Rent',
    value: 25000,
  },
];

export const mobileOS = [
  {
    label: 'Income',
    value: 50000,
  },
  {
    label: 'Expense',
    value: 55000,
  },
  
  {
    label: 'Fuel',
    value: 15000,
  },
  {
    label: 'Groceries',
    value: 30000,
  },
  {
    label: 'Bike Maintance',
    value: 18000,
  },
  {
    label: 'House Rent',
    value: 25000,
  },
];

export const platforms = [
  {
    label: 'Income',
    value: 50000,
  },
  {
    label: 'Expense',
    value: 55000,
  },
  
  {
    label: 'Fuel',
    value: 15000,
  },
  {
    label: 'Groceries',
    value: 30000,
  },
  {
    label: 'Bike Maintance',
    value: 18000,
  },
  {
    label: 'House Rent',
    value: 25000,
  },
];

const normalize = (v: number, v2: number) => Number.parseFloat(((v * v2) / 100).toFixed(2));

export const mobileAndDesktopOS = [
  ...mobileOS.map((v) => ({
    ...v,
    label: v.label === 'Other' ? 'Other (Mobile)' : v.label,
    value: normalize(v.value, platforms[0].value),
  })),
  ...desktopOS.map((v) => ({
    ...v,
    label: v.label === 'Other' ? 'Other (Desktop)' : v.label,
    value: normalize(v.value, platforms[1].value),
  })),
];

export const valueFormatter = (item: { value: number }) => `${item.value}pkr`;

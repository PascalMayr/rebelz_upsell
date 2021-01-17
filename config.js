const planNames = {
  free: 'FREE Plan',
  pro: 'PRO Plan',
  business: 'BUSINESS Plan',
};

const plans = [
  {
    name: planNames.free,
    amount: 0,
    currency: 'USD',
    limit: 500,
  },
  {
    name: planNames.pro,
    amount: 39.99,
    currency: 'USD',
    limit: 10000,
  },
  {
    name: planNames.business,
    amount: 69.99,
    currency: 'USD',
    limit: 100000,
  },
];

const config = {
  planNames,
  plans,
};

export default config;

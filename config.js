const planNames = {
  free: 'FREE',
  plus: 'PLUS',
  pro: 'PRO',
  business: 'BUSINESS',
};

const plans = [
  {
    name: planNames.free,
    amount: 0,
    currency: 'USD',
    limit: 250,
  },
  {
    name: planNames.plus,
    amount: 19.99,
    currency: 'USD',
    limit: 2000,
  },
  {
    name: planNames.pro,
    amount: 49.99,
    currency: 'USD',
    limit: 5000,
  },
  {
    name: planNames.business,
    amount: 99.99,
    currency: 'USD',
    limit: 10000,
  },
];

const config = {
  planNames,
  plans,
};

export default config;

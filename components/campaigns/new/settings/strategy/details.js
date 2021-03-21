import { useEffect } from 'react';
import { TextField, Select } from '@shopify/polaris';
import '../../../../../styles/components/campaigns/new/settings/strategy/details.css';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';

import { DefaultStateStrategy } from '../../../../../pages/campaigns/new/defaultState';

const GET_STORE_CURRENCY = gql`
  query storeCurrency {
    shop {
      currencyCode
    }
  }
`;

const DetailsStrategy = ({ strategy = DefaultStateStrategy, onChange }) => {
  const onDiscountSettingsChange = (setting, value) => {
    onChange({ ...strategy, [setting]: value });
  };
  const { data } = useQuery(GET_STORE_CURRENCY);
  const currencyCode = data && data.shop && data.shop.currencyCode;
  useEffect(() => {
    if (currencyCode) {
      onDiscountSettingsChange('storeCurrencyCode', currencyCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyCode]);
  let salestormStrategyContainerClass;
  switch (strategy.mode) {
    case 'free_shipping':
      salestormStrategyContainerClass =
        'salestorm-strategy-settings salestorm-free-shipping-strategy';
      break;
    case 'gift':
      salestormStrategyContainerClass =
        'salestorm-strategy-settings salestorm-free-shipping-strategy';
      break;
    default:
      salestormStrategyContainerClass = 'salestorm-strategy-settings';
      break;
  }
  return (
    <div className={salestormStrategyContainerClass}>
      {strategy.mode !== 'gift' && (
        <Select
          options={[
            { label: 'Cross sell - add', value: 'cross_sell' },
            { label: 'Upsell - replace', value: 'upsell' },
          ]}
          onChange={(value) => onDiscountSettingsChange('sellType', value)}
          value={strategy.sellType}
        />
      )}
      <div>
        <TextField
          type="number"
          min="0"
          value={strategy.minOrderValue}
          id="minOrderValue"
          onChange={(value) => onDiscountSettingsChange('minOrderValue', value)}
          placeholder={strategy.minOrderValue}
          label="Min total order value"
          suffix={currencyCode}
        />
      </div>
      <TextField
        type="number"
        min="0"
        value={strategy.maxOrderValue}
        id="maxOrderValue"
        onChange={(value) => onDiscountSettingsChange('maxOrderValue', value)}
        placeholder={strategy.maxOrderValue}
        label="Max total order value"
        suffix={currencyCode}
      />
      {strategy.mode === 'discount' && (
        <div className="salestorm-discount">
          <TextField
            type="number"
            min="1"
            value={strategy.discount.value}
            id="discount"
            onChange={(value) =>
              onDiscountSettingsChange('discount', {
                ...strategy.discount,
                value,
              })
            }
            placeholder={strategy.discount.value}
            label="Discount"
            connectedRight={
              <Select
                options={[
                  { label: currencyCode, value: currencyCode },
                  { label: '%', value: '%' },
                ]}
                onChange={(value) =>
                  onDiscountSettingsChange('discount', {
                    ...strategy.discount,
                    type: value,
                  })
                }
                value={strategy.discount.type}
              />
            }
          />
        </div>
      )}
    </div>
  );
};

export default DetailsStrategy;

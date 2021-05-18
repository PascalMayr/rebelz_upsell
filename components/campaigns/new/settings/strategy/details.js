import { useEffect } from 'react';
import { TextField, Select } from '@shopify/polaris';
import { useQuery } from '@apollo/client';

import GET_STORE_CURRENCY from '../../../../../server/handlers/queries/get_store_currency';
import { DefaultStateStrategy } from '../../defaultState';

const DetailsStrategy = ({
  strategy = DefaultStateStrategy,
  onChange,
  targets,
}) => {
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
  const sellTypeOptions =
    targets && targets.page !== 'thank_you'
      ? [
          { label: 'Cross sell', value: 'cross_sell' },
          { label: 'Upsell', value: 'upsell' },
        ]
      : [{ label: 'Cross sell', value: 'cross_sell' }];
  return (
    <div className={salestormStrategyContainerClass}>
      {strategy.mode !== 'gift' && (
        <Select
          options={sellTypeOptions}
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

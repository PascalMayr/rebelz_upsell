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
        'strategy-settings free-shipping-strategy';
      break;
    case 'gift':
      salestormStrategyContainerClass =
        'strategy-settings free-shipping-strategy';
      break;
    default:
      salestormStrategyContainerClass = 'strategy-settings';
      break;
  }
  const sellTypeOptions =
    targets && targets.page !== 'thank_you'
      ? [
          { label: 'Cross sell', value: 'cross_sell', key: 'crossSell' },
          { label: 'Upsell', value: 'upsell', key: 'upSell' },
        ]
      : [{ label: 'Cross sell', value: 'cross_sell', key: 'crossSell' }];
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
          label="Min cart value"
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
        label="Max cart value"
        suffix={currencyCode}
      />
      {strategy.mode === 'discount' && (
        <div className="discount">
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
                  { label: currencyCode, value: currencyCode, key: 'fix' },
                  { label: '%', value: '%', key: 'percentage' },
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

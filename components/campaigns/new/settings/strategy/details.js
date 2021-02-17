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
  return (
    <div className="salestorm-strategy-settings">
      {strategy.mode !== 'gift' && (
        <Select
          options={[
            { label: 'Cross sell', value: 'cross_sell' },
            { label: 'Upsell', value: 'upsell' },
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
            min="0"
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

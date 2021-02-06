import { SelectMinor } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';

const WebComponentProductVariationsPopup = ({ slot, options = [] }) => (
  <div slot={slot}>
    {options.map((option) => {
      if (option.name === 'Title') {
        return null;
      } else {
        return (
          <div
            className="salestorm-product-select-container"
            key={`${option.name}-select-container`}
          >
            <select
              className="salestorm-product-select"
              key={`${option.name}-select`}
            >
              {option.values.map((value) => (
                <option
                  value={value}
                  key={`${option.name}-${value}-select-option`}
                >
                  {value}
                </option>
              ))}
            </select>
            <div
              className="salestorm-product-select-arrow"
              key={`${option.name}-select-arrow`}
            >
              <Icon
                source={SelectMinor}
                key={`${option.name}-select-arrow-icon`}
              />
            </div>
          </div>
        );
      }
    })}
  </div>
);

export default WebComponentProductVariationsPopup;

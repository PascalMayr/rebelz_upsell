import Image from 'next/image';
import { RadioButton } from '@shopify/polaris';
import '../styles/components_salestorm_triggers.css';

const CampaignTriggers = ({ trigger, setCampaignProperty }) => {
  return (
    <div className="salestorm-triggers">
      <div
        className="salestorm-triggers-option"
        onClick={() => setCampaignProperty('add_to_cart', 'trigger')}
      >
        <Image
          src="/add_to_cart.svg"
          alt="Add to cart"
          width="250"
          height="250"
        />
        <RadioButton
          label="Show on add to cart"
          id="add_to_cart"
          checked={trigger === 'add_to_cart'}
          name="triggers"
          onChange={(_checked, value) => setCampaignProperty(value, 'trigger')}
        />
      </div>
      <div
        className="salestorm-triggers-option"
        onClick={() => setCampaignProperty('checkout', 'trigger')}
        onKeyDown={() => {}}
      >
        <Image
          src="/before_checkout.svg"
          alt="Before checkout"
          width="250"
          height="250"
        />
        <RadioButton
          label="Show before checkout"
          id="checkout"
          checked={trigger === 'checkout'}
          name="triggers"
          onChange={(_checked, value) => setCampaignProperty(value, 'trigger')}
        />
      </div>
    </div>
  );
};

export default CampaignTriggers;

import Image from 'next/image';
import { RadioButton } from '@shopify/polaris';
import '../../../styles/components_salestorm_triggers.css';

const CampaignTriggers = ({ campaign, setCampaignProperty }) => {
  const trigger = campaign.trigger;
  const changeTrigger = (newTrigger) => {
    const checkoutActionText =
      newTrigger === 'add_to_cart'
        ? 'Go to cart'
        : newTrigger === 'checkout'
        ? 'Go to checkout'
        : 'Continue shopping';
    setCampaignProperty(newTrigger, 'trigger', {
      texts: { ...campaign.texts, checkoutAction: checkoutActionText },
    });
  };
  return (
    <div className="salestorm-triggers">
      <div
        className="salestorm-triggers-option"
        onClick={() => changeTrigger('add_to_cart')}
        onKeyDown={() => changeTrigger('add_to_cart')}
      >
        <Image
          src="/add_to_cart.svg"
          alt="Add to cart"
          width="150"
          height="150"
        />
        <RadioButton
          label="On add to cart"
          id="add_to_cart"
          checked={trigger === 'add_to_cart'}
          name="triggers"
          onChange={(_checked, value) => changeTrigger(value)}
        />
      </div>
      <div
        className="salestorm-triggers-option"
        onClick={() => changeTrigger('checkout')}
        onKeyDown={() => changeTrigger('checkout')}
      >
        <Image
          src="/before_checkout.svg"
          alt="Before checkout"
          width="150"
          height="150"
        />
        <RadioButton
          label="Before checkout"
          id="checkout"
          checked={trigger === 'checkout'}
          name="triggers"
          onChange={(_checked, value) => changeTrigger(value)}
        />
      </div>
      <div
        className="salestorm-triggers-option"
        onClick={() => changeTrigger('thank_you')}
        onKeyDown={() => changeTrigger('thank_you')}
      >
        <Image src="/thank_you.svg" alt="Thank you" width="150" height="150" />
        <RadioButton
          label="On the Thank you page"
          id="thank_you"
          checked={trigger === 'thank_you'}
          name="triggers"
          onChange={(_checked, value) => {
            changeTrigger(value);
          }}
        />
      </div>
    </div>
  );
};

export default CampaignTriggers;

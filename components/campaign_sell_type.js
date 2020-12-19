import Image from 'next/image';
import { RadioButton } from '@shopify/polaris';
import '../styles/components_salestorm_triggers.css';

const CampaignSellType = ({sell_type, setCampaignProperty}) => {
  return (
    <div className='salestorm-triggers'>
    <div className='salestorm-triggers-option'>
      <Image src="/upsell.svg" alt="up-sell" width="250" height="250" />
        <RadioButton
          label="Up-sell products"
          id="up-sell"
          checked={sell_type === 'up-sell'}
          name="sell_type"
          onChange={(_checked, value) => setCampaignProperty(value, 'sell_type')}
        />
      </div>
    <div className='salestorm-triggers-option'>
      <Image src="/cross-sell.svg" alt="cross-sell" width="250" height="250" />
      <RadioButton
        label="Cross-sell products"
        id="cross-sel"
        checked={sell_type === 'cross-sel'}
        name="sell_type"
        onChange={(_checked, value) => setCampaignProperty(value, 'sell_type')}
      />
    </div>
  </div>
  )
}

export default CampaignSellType
import { Badge, TextStyle, Icon } from '@shopify/polaris';
import {
  CartMajor,
  HeartMajor,
  ProductsMajor,
  ViewMajor,
  ReplaceMajor,
  CartUpMajor,
  ShipmentMajor,
  DiscountsMajor,
  GiftCardMajor,
  WandMajor,
} from '@shopify/polaris-icons';
import '../styles/components/campaign.css';

const Campaign = ({ campaign }) => {
  const page = campaign.targets.page;
  const sellType = campaign.strategy.sellType;
  const mode = campaign.strategy.mode;
  const publishedStatus = campaign.published ? 'success' : 'attention';
  const publishedStatusText = campaign.published
    ? ' Published'
    : ' Unpublished';
  const views = campaign.views ? campaign.views : 0;
  return (
    <>
      <h3 className="salestorm-campaign-title">
        <TextStyle>{campaign.name}</TextStyle>
      </h3>
      <Badge status={publishedStatus}>
        <Icon source={ViewMajor} />
        {publishedStatusText} {views} Views
      </Badge>
      <Badge status="info">
        {page === 'add_to_cart' && (
          <>
            <Icon source={ProductsMajor} />
            {' Product Page'}
          </>
        )}
        {page === 'checkout' && (
          <>
            <Icon source={CartMajor} />
            {' Cart Page'}
          </>
        )}
        {page === 'thank_you' && (
          <>
            <Icon source={HeartMajor} />
            {' Thank you Page'}
          </>
        )}
      </Badge>
      <Badge>
        {sellType === 'upsell' && (
          <>
            <Icon source={ReplaceMajor} />
            Upsell
          </>
        )}
        {sellType === 'cross_sell' && (
          <>
            <Icon source={CartUpMajor} />
            Cross sell
          </>
        )}
      </Badge>
      <Badge status="warning">
        {mode === 'free_shipping' && (
          <>
            <Icon source={ShipmentMajor} />
            Free Shipping
          </>
        )}
        {mode === 'discount' && (
          <>
            <Icon source={DiscountsMajor} />
            Discount
          </>
        )}
        {mode === 'gift' && (
          <>
            <Icon source={GiftCardMajor} />
            Gift
          </>
        )}
      </Badge>
      {campaign.selling.mode === 'auto' && (
        <Badge>
          <Icon source={WandMajor} />
          Auto Recommendations
        </Badge>
      )}
    </>
  );
};

export default Campaign;

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
} from '@shopify/polaris-icons';
import '../styles/components/campaign.css';

const Campaign = ({ campaign }) => {
  const { name, published, targets, strategy } = campaign;
  const page = targets.page;
  const sellType = strategy.sellType;
  const mode = strategy.mode;
  const publishedStatus = published ? 'success' : 'attention';
  const publishedStatusText = published ? ' Published' : ' Unpublished';
  return (
    <>
      <h3 className="salestorm-campaign-title">
        <TextStyle>{name}</TextStyle>
      </h3>
      <Badge status={publishedStatus}>
        <Icon source={ViewMajor} />
        {publishedStatusText}
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
    </>
  );
};

export default Campaign;
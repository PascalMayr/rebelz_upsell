import { Card, List, Button, Heading } from '@shopify/polaris';
import '../styles/components_salestorm_pricing_card.css';

const PricingCard = ({
  title = '',
  list = [],
  button = () => <Button primary>Choose this plan</Button>,
  subtitle = '',
}) => {
  return (
    <div className="salestorm-pricing-card">
      <Card title={title}>
        <Heading element="h3">{subtitle}</Heading>
        <Card.Section>
          <List className="pricing-list" style={{ listStyle: 'none' }}>
            {list.map((listItem) => (
              <List.Item key={listItem}>
                <span className="salestorm-pricing-card-checkmark">✓</span>
                {listItem}
              </List.Item>
            ))}
          </List>
          <div className="salestorm-pricing-card-button-container">
            {button}
          </div>
        </Card.Section>
      </Card>
    </div>
  );
};

export default PricingCard;

import { Badge, TextStyle, Icon } from '@shopify/polaris';
import { ViewMajor } from '@shopify/polaris-icons';
import '../styles/components/campaign.css';

const Campaign = ({ campaign }) => {
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
    </>
  );
};

export default Campaign;

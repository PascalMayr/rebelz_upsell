import { Badge, TextStyle, Icon } from '@shopify/polaris';
import { HideMinor, ViewMinor } from '@shopify/polaris-icons';

const Campaign = ({ campaign: { published, views, name } }) => {
  const publishedStatus = published ? 'success' : 'attention';
  const icon = published ? ViewMinor : HideMinor;
  return (
    <div className="campaign-status">
      <h3 className="campaign-title">
        <TextStyle>{name}</TextStyle>
      </h3>
      <Badge status={publishedStatus}>
        <Icon source={icon} />
        {views || 0} views
      </Badge>
    </div>
  );
};

export default Campaign;

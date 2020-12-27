import { Modal, TextContainer } from '@shopify/polaris';
import { useState, useContext } from 'react';

import deleteCampaign from '../services/delete_campaign';
import { AppContext } from '../pages/_app';

const CampaignDeleteModal = ({ campaign, removeFromList, onClose }) => {
  const context = useContext(AppContext);
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);

  return (
    <Modal
      open={Boolean(campaign)}
      onClose={onClose}
      title="Are you sure you want to delete this campaign?"
      primaryAction={{
        content: 'Delete',
        loading: deleteButtonLoading,
        onAction: async () => {
          setDeleteButtonLoading(true);
          let toast;
          try {
            await deleteCampaign(campaign.id);
            removeFromList(campaign);
            toast = {
              shown: true,
              content: 'Campaign deleted',
              isError: false,
            };
          } catch (_error) {
            toast = {
              shown: true,
              content: 'Failed to delete campaign',
              isError: true,
            };
          } finally {
            setDeleteButtonLoading(false);
            onClose();
            context.setToast(toast);
          }
        },
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>
            Please click &quot;Delete&quot; if you really want to delete&nsbp;
            {campaign.name}.
          </p>
        </TextContainer>
      </Modal.Section>
    </Modal>
  );
};

export default CampaignDeleteModal;

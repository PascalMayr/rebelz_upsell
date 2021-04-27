import { Modal } from '@shopify/app-bridge-react';
import { useState, useContext } from 'react';

import { AppContext } from '../pages/_app';

import useApi from './hooks/use_api';

const CampaignDeleteModal = ({ campaign, removeFromList, onClose }) => {
  const context = useContext(AppContext);
  const api = useApi();
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);

  return (
    <Modal
      open={Boolean(campaign)}
      onClose={onClose}
      title="Are you sure you want to delete this campaign?"
      message={`Please click "Delete" if you really want to delete ${campaign.name}.`}
      primaryAction={{
        content: 'Delete',
        loading: deleteButtonLoading,
        onAction: async () => {
          setDeleteButtonLoading(true);
          let toast;
          try {
            await api.delete(`/api/delete-campaign/${campaign.id}`);
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
    />
  );
};

export default CampaignDeleteModal;

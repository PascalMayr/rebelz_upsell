import { useState, useContext } from 'react';
import { ResourcePicker } from '@shopify/app-bridge-react';
import {
  Button,
  ResourceList,
  ResourceItem,
  TextStyle,
  Icon,
} from '@shopify/polaris';
import { MobileCancelMajor, ImageMajor } from '@shopify/polaris-icons';
import { ApolloConsumer } from 'react-apollo';

import { AppContext } from '../../../pages/_app';
import '../../../styles/components/campaigns/new/resource_selection.css';
import GET_PRODUCT from '../../../server/handlers/queries/get_product';
import GET_COLLECTION from '../../../server/handlers/queries/get_collection';

import DetailsStrategy from './settings/strategy/details';

const ResourceSelectionCampaign = ({
  resourcePickerProps,
  buttonProps,
  resources = [],
  onResourceMutation,
  strategy,
  showStrategyDetails,
  targets,
}) => {
  const context = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { label } = buttonProps;
  const removeResource = (id) => {
    onResourceMutation(
      resources.filter((findResource) => findResource.id !== id)
    );
  };
  const getInitialSelectionIds = (helper) => {
    return helper.map((resource) => {
      if (resourcePickerProps.resourceType === 'Product' && resource) {
        return {
          id: resource.id,
          variants: resource.variants.edges.map((edge) => edge.node.id),
        };
      } else if (
        resourcePickerProps.resourceType === 'Collection' &&
        resource
      ) {
        return {
          id: resource.id,
        };
      } else {
        return {
          id: '',
          variants: '',
        };
      }
    });
  };
  return (
    <>
      <div className="salestorm-resources">
        <ResourceList
          items={resources}
          renderItem={(resource) => {
            const { title, id } = resource;
            let thumbnail;
            const ThumbnailPlaceholder = () => (
              <div className="salestorm-resource-image-placeholder">
                <Icon source={ImageMajor} />
              </div>
            );
            if (resourcePickerProps.resourceType === 'Product') {
              if (
                resource.featuredImage &&
                resource.featuredImage.transformedSrc
              ) {
                thumbnail = (
                  <img
                    src={resource.featuredImage.transformedSrc}
                    alt={resource.featuredImage.altText}
                  />
                );
              } else {
                thumbnail = <ThumbnailPlaceholder />;
              }
            } else if (resource.image) {
              thumbnail = <img src={resource.image} alt={title} />;
            } else {
              thumbnail = <ThumbnailPlaceholder />;
            }
            return (
              <ResourceItem
                id={id}
                accessibilityLabel={`View details for ${title}`}
                key={`${id}-resource`}
              >
                <div className="salestorm-resource-item-container">
                  <div className="salestorm-resource-item">
                    <div className="salestorm-resource-item-info">
                      {thumbnail}
                      <TextStyle variation="strong">{title}</TextStyle>
                    </div>
                    <div className="salestorm-resource-actions">
                      <div
                        className="salestorm-resource-remove"
                        onClick={() => removeResource(id)}
                        onKeyDown={() => removeResource(id)}
                      >
                        <Icon source={MobileCancelMajor} />
                      </div>
                    </div>
                  </div>
                  {resource.strategy &&
                    resources.length > 1 &&
                    showStrategyDetails && (
                      <>
                        <br />
                        <DetailsStrategy
                          strategy={resource.strategy}
                          targets={targets}
                          onChange={(newDiscountStrategy) => {
                            const helperResources = resources;
                            const modifiedResource = helperResources.find(
                              (currentResource) =>
                                currentResource.id === resource.id
                            );
                            if (modifiedResource) {
                              modifiedResource.strategy = newDiscountStrategy;
                            }
                            onResourceMutation(helperResources);
                          }}
                        />
                      </>
                    )}
                </div>
              </ResourceItem>
            );
          }}
        />
      </div>
      <ApolloConsumer>
        {(client) => (
          <ResourcePicker
            {...resourcePickerProps}
            initialSelectionIds={getInitialSelectionIds(resources)}
            open={open}
            onCancel={() => setOpen(false)}
            onSelection={async (selectPayload) => {
              setOpen(false);
              try {
                if (resourcePickerProps.resourceType === 'Product') {
                  setLoading(true);
                  const products = await Promise.all(
                    selectPayload.selection.map(async (resource) => {
                      const product = await client.query({
                        query: GET_PRODUCT,
                        variables: {
                          id: resource.id,
                        },
                      });
                      const productData = product.data.product;
                      productData.strategy = strategy;

                      return productData;
                    })
                  );
                  setLoading(false);
                  onResourceMutation(products);
                } else {
                  setLoading(true);
                  const collections = await Promise.all(
                    selectPayload.selection.map(async (resource) => {
                      const collection = await client.query({
                        query: GET_COLLECTION,
                        variables: {
                          id: resource.id,
                        },
                      });
                      const collectionData = collection.data.collection;

                      return collectionData;
                    })
                  );
                  setLoading(false);
                  onResourceMutation(collections);
                }
              } catch (e) {
                context.setToast({
                  shown: true,
                  content: 'Failed to load details',
                  isError: true,
                });
                throw e;
              } finally {
                setLoading(false);
              }
            }}
          />
        )}
      </ApolloConsumer>
      <div
        className="salestorm-add-resource-button-container"
        style={{
          display:
            !resourcePickerProps.selectMultiple && resources.length === 1
              ? 'none'
              : 'flex',
        }}
      >
        <Button
          {...buttonProps}
          onClick={() => setOpen(true)}
          loading={loading}
        >
          {label}
        </Button>
      </div>
    </>
  );
};

export default ResourceSelectionCampaign;

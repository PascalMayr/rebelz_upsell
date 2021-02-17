import { useState } from 'react';
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
import { gql } from 'apollo-boost';

import DetailsStrategy from './settings/strategy/details';
import '../../../styles/components/campaigns/new/resource_selection.css';

const GET_PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      legacyResourceId
      title
      descriptionHtml
      options(first: 3) {
        values
        name
        position
      }
      legacyResourceId
      images(first: 1) {
        edges {
          node {
            transformedSrc(maxHeight: 500)
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            title
            id
            legacyResourceId
            selectedOptions {
              name
              value
            }
            image {
              transformedSrc(maxHeight: 500)
            }
          }
        }
      }
      updatedAt
      createdAt
    }
  }
`;

const GET_COLLECTION = gql`
  query Product($id: ID!) {
    collection(id: $id) {
      id
      image {
        transformedSrc(maxHeight: 75)
      }
      title
    }
  }
`;

const ResourceSelectionCampaign = ({
  resourcePickerProps,
  buttonProps,
  resources = [],
  onResourceMutation,
  setCampaignProperty,
  strategy,
}) => {
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
              if (resource.images.edges.length > 0) {
                thumbnail = (
                  <img
                    src={resource.images.edges[0].node.transformedSrc}
                    alt={resource.images.edges[0].node.altText}
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
                  {resource.strategy && resources.length > 1 && (
                    <>
                      <br />
                      <DetailsStrategy
                        strategy={resource.strategy}
                        onChange={(newDiscountStrategy) => {
                          setCampaignProperty(
                            {
                              ...strategy,
                              ...newDiscountStrategy,
                            },
                            'strategy'
                          );
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
              if (resourcePickerProps.resourceType === 'Product') {
                setLoading(true);
                const products = await Promise.all(
                  selectPayload.selection.map(async (resource) => {
                    const { id, title } = resource;
                    try {
                      const product = await client.query({
                        query: GET_PRODUCT,
                        variables: {
                          id,
                        },
                      });
                      const productData = product.data.product;
                      if (strategy) {
                        return {
                          ...productData,
                          strategy,
                        };
                      } else {
                        return productData;
                      }
                    } catch (error) {
                      console.log(
                        `Failed to load product data for product: ${title}`
                      );
                    }
                  })
                );
                setLoading(false);
                onResourceMutation(products);
              } else {
                setLoading(true);
                const collections = await Promise.all(
                  selectPayload.selection.map(async (resource) => {
                    const { id, title } = resource;
                    try {
                      const collection = await client.query({
                        query: GET_COLLECTION,
                        variables: {
                          id,
                        },
                      });
                      const collectionData = collection.data.collection;
                      return collectionData;
                    } catch (error) {
                      console.log(
                        `Failed to load collection data for collection: ${title}`
                      );
                    }
                  })
                );
                setLoading(false);
                onResourceMutation(collections);
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

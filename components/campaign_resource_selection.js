import { useState } from 'react';
import { ResourcePicker } from '@shopify/app-bridge-react';
import {
  Button,
  ResourceList,
  ResourceItem,
  TextStyle,
  TextField,
  Select,
  Icon,
} from '@shopify/polaris';
import { MobileCancelMajor, ImageMajor } from '@shopify/polaris-icons';
import { ApolloConsumer, useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import '../styles/components_resource_selection.css';

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

const GET_STORE_CURRENCY = gql`
  query storeCurrency {
    shop {
      currencyCode
    }
  }
`;

const CampaignResourceSelection = ({
  resourcePickerProps,
  buttonProps,
  resources = [],
  onResourceMutation,
  applyDiscount,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { label } = buttonProps;
  const { data } = useQuery(GET_STORE_CURRENCY);
  const currencyCode = data && data.shop && data.shop.currencyCode;
  const removeResource = (id) => {
    onResourceMutation(
      resources.filter((findResource) => findResource.id !== id)
    );
  };
  return (
    <>
      <div className="salestorm-resources">
        <ResourceList
          items={resources}
          renderItem={(resource) => {
            const { title, id, images, discount } = resource;
            let thumbnail;
            if (images.edges.length > 0) {
              thumbnail = (
                <img
                  src={images.edges[0].node.transformedSrc}
                  alt={images.edges[0].node.altText}
                />
              );
            } else {
              thumbnail = (
                <div className="salestorm-resource-image-placeholder">
                  <Icon source={ImageMajor} />
                </div>
              );
            }
            return (
              <ResourceItem
                id={id}
                accessibilityLabel={`View details for ${title}`}
              >
                <div className="salestorm-resource-item">
                  <div className="salestorm-resource-item-info">
                    {thumbnail}
                    <TextStyle variation="strong">{title}</TextStyle>
                  </div>
                  <div className="salestorm-resource-actions">
                    {applyDiscount && (
                      <div className="salestorm-resource-discount">
                        <TextField
                          value={`${discount.value}`}
                          onChange={(value) => {
                            const helperResources = resources.map(
                              (helperResource) => {
                                if (helperResource.id === id) {
                                  helperResource.discount.value = value;
                                }
                                return helperResource;
                              }
                            );
                            onResourceMutation(helperResources);
                          }}
                          placeholder="Discount"
                        />
                        <Select
                          options={[
                            { label: currencyCode, value: currencyCode },
                            { label: '%', value: '%' },
                          ]}
                          onChange={(value) => {
                            const helperResources = resources.map(
                              (helperResource) => {
                                if (helperResource.id === id) {
                                  helperResource.discount.type = value;
                                }
                                return helperResource;
                              }
                            );
                            onResourceMutation(helperResources);
                          }}
                          value={discount.type}
                        />
                      </div>
                    )}
                    <div
                      className="salestorm-resource-remove"
                      onClick={() => removeResource(id)}
                      onKeyDown={() => removeResource(id)}
                    >
                      <Icon source={MobileCancelMajor} />
                    </div>
                  </div>
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
                      return applyDiscount
                        ? {
                            ...productData,
                            discount: { type: currencyCode, value: 5 },
                          }
                        : productData;
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
                onResourceMutation(selectPayload.selection);
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

export default CampaignResourceSelection;

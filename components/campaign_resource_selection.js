import { useState } from 'react';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { Button, ResourceList, ResourceItem, TextStyle, TextField, Select, Icon } from '@shopify/polaris';
import {
  MobileCancelMajor,
  ImageMajor
} from '@shopify/polaris-icons';
import { ApolloConsumer } from 'react-apollo';
import { gql } from 'apollo-boost';
import '../styles/components_resource_selection.css';
import getSymbolFromCurrency from 'currency-symbol-map';

const GET_PRODUCT = gql`
  query Product($id: ID!) {
    product (id: $id) {
      id
      legacyResourceId
      title
      descriptionHtml
      images(first: 1) {
        edges {
          node {
            altText
            transformedSrc(maxWidth: 75)
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            selectedOptions {
              name
            }
            product {
              id
              legacyResourceId
              title
              priceRange {
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    altText
                    transformedSrc(maxWidth: 500)
                  }
                }
              }
            }
          }
        }
      }
      updatedAt
      createdAt
    }
  }
`

const CampaignResourceSelection = ({
  resourcePickerProps,
  buttonProps,
  resources = [],
  onResourceMutation,
  applyDiscount
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const { label } = buttonProps;
  return (
    <>
      <div className='salestorm-resources'>
        <ResourceList
          items={resources}
          renderItem={(resource) => {
            const { title, id, images, discount } = resource;
            const { node: { product: { priceRange: { maxVariantPrice: { currencyCode }} } } } = resource.variants.edges[0];
            return (
              <ResourceItem
                id={id}
                accessibilityLabel={`View details for ${title}`}
              >
                <div className='salestorm-resource-item'>
                  <div className='salestorm-resource-item-info'>
                    {
                      images.edges.length > 0 ?
                      <img src={images.edges[0].node.transformedSrc} alt={images.edges[0].node.altText}/>
                      :
                      <div className='salestorm-resource-image-placeholder'>
                        <Icon source={ImageMajor} />
                      </div>
                    }
                    <TextStyle variation="strong">{title}</TextStyle>
                  </div>
                  <div className='salestorm-resource-actions'>
                    {
                      applyDiscount &&
                      <div className='salestorm-resource-discount'>
                        <TextField
                          value={`${discount.value}`}
                          onChange={(value) => {
                            let helperResources = resources.map(resource => {
                              if (resource.id === id) {
                                resource.discount.value = value;
                              }
                              return resource;
                            });
                            onResourceMutation(helperResources);
                          }}
                          placeholder='Discount'
                        />
                        <Select
                          options={[
                            { label: getSymbolFromCurrency(currencyCode), value: getSymbolFromCurrency(currencyCode) },
                            { label: '%', value: '%'}
                          ]}
                          onChange={(value) => {
                            let helperResources = resources.map(resource => {
                              if (resource.id === id) {
                                resource.discount.type = value;
                              }
                              return resource;
                            });
                            onResourceMutation(helperResources);
                          }}
                          value={discount.type}
                        />
                      </div>
                    }
                    <div className='salestorm-resource-remove' onClick={() => {
                      onResourceMutation(resources.filter(findResource => findResource.id !== id))
                    }}>
                      <Icon source={MobileCancelMajor} />
                    </div>
                  </div>
                </div>
              </ResourceItem>
            )
          }}
        />
      </div>
      <ApolloConsumer>
        {
          client => (
            <ResourcePicker
              {...resourcePickerProps}
              open={open}
              onCancel={() => setOpen(false)}
              onSelection={async (selectPayload) => {
                setOpen(false);
                if (resourcePickerProps.resourceType === 'Product') {
                  setLoading(true);
                  const products = await Promise.all(selectPayload.selection.map(async (resource) => {
                    const { id } = resource;
                    const product = await client.query({
                      query: GET_PRODUCT,
                      variables: {
                        id
                    }});
                    const product_data = product.data.product;
                    const { node: { product: { priceRange: { maxVariantPrice: { currencyCode }} } } } = product_data.variants.edges[0];
                    return applyDiscount ? {...product_data, discount: { type: getSymbolFromCurrency(currencyCode), value: 5 }} : product_data;
                  }));
                  setLoading(false);
                  onResourceMutation(products);
                }
                else {
                  onResourceMutation(selectPayload.selection);
                }
              }}
            />
          )
        }
      </ApolloConsumer>
      {
        resourcePickerProps.selectMultiple || resources.length === 0 ?
        <div className='salestorm-add-resource-button-container'>
          <Button {...buttonProps} onClick={() => setOpen(true)} loading={loading}>
            {label}
          </Button>
        </div>
        :
        <></>
      }
    </>
  );
};

export default CampaignResourceSelection;

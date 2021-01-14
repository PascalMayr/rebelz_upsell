import React from 'react';
import { kebabCasify } from 'casify';
import '../styles/components_campaign_preview.css';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import CampaignProduct from './campaign_product';
import ErrorMessage from './error/error_message';
import { Spinner } from '@shopify/polaris';

const CampaignPreview = ({
  campaign,
  isPreviewDesktop,
  popupRef,
  setCampaignProperty,
}) => {
  const GET_PRODUCT_DETAILS = (id) => gql`
    query {
      product(id: "${id}") {
        title
        priceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 3) {
          edges {
            node {
              transformedSrc(maxWidth: ${parseInt(campaign.styles.popup.width, 10)})
              altText
            }
          }
        }
      }
    }
  `;
  const styles = isPreviewDesktop ? campaign.styles : campaign.mobileStyles;
  const mobileContainerClass = !isPreviewDesktop ? 'salestorm-mobile-preview-container' : '';
  const campaignMessageKey = isPreviewDesktop ? 'message' : 'mobileMessage';
  const styleObjectToStyleString = (styleObject) => {
    const kebabCaseStyles = kebabCasify(styleObject);
    return Object.keys(kebabCaseStyles).map(styleKey => `${styleKey}: ${kebabCaseStyles[styleKey]}`).join(';');
  }
  const campaignCSS = `
    #salestorm-popup {
      ${styleObjectToStyleString(styles.popup)}
    }
  `;
  const campaignJavascript = () => {
    // Javascript which will be execuded in the Theme if the campaign HTML is loaded into the Theme HTML
  };
  const campaignJavascriptNativeCodeString = `${campaignJavascript.toString()}; campaignJavascript();`;
  return (
    <>
      <div className="salestorm-popup-preview-container">
        <div className={mobileContainerClass}>
          <style>
            {
              campaignCSS
            }
          </style>
          <div
            id="salestorm-popup"
            ref={popupRef}
          >
            <br />
            {
              campaign.products.selling.map(product => (
                <div className='popup-product-container' key={product.id}>
                  <Query query={GET_PRODUCT_DETAILS(product.id)}>
                    {({ loading, error, data }) => {
                      if (loading) return <div id='product-loading-container'><Spinner accessibilityLabel="Small spinner" size="small" color="teal" /></div>;
                      if (error) return <ErrorMessage whileMessage='while loading the products.' />;
                      return <CampaignProduct data={data} productKey={product.id} campaign={campaign} />
                    }}
                  </Query>
                </div>
              ))
            }
          </div>
          <script>
            {
              // used to try in React Preview
              campaignJavascript()
            }
            {
              campaignJavascriptNativeCodeString
            }
          </script>
        </div>
      </div>
    </>
  );
};

export default CampaignPreview;

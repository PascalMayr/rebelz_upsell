import { kebabCasify } from 'casify';
import '../styles/components_campaign_preview.css';
import {
  MobileCancelMajor
} from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';
import tinycolor from 'tinycolor2';

const CampaignPreview = ({
  campaign,
  isPreviewDesktop
}) => {
  const mobileContainerClass = !isPreviewDesktop ? 'salestorm-mobile-preview-container' : 'salestorm-desktop-preview-container';
  let styles = isPreviewDesktop
    ? campaign.styles
    : campaign.mobileStyles;

  const styleObjectToStyleString = (styleObject) => {
    const kebabCaseStyles = kebabCasify(styleObject);
    return Object.keys(kebabCaseStyles).map(styleKey => `${styleKey}: ${kebabCaseStyles[styleKey]}`).join(';');
  }

  const campaignProduct = campaign.products.selling[0];
  const campaignProductImage = campaignProduct && campaignProduct.variants.edges[0].node.product.images.edges.length > 0 && campaignProduct.variants.edges[0].node.product.images.edges[0].node.transformedSrc;
  const campaignProductTitle = campaignProduct && campaignProduct.title;
  const campaignDiscount = campaignProduct && `${campaignProduct.discount.value}${campaignProduct.discount.type}`;

  const popupJS = () => {
    // JS used in the popup to hide, chnange variants, show timer
    const selling_products = campaign.products.selling;
  }

  const campaignJS = `
    ${popupJS.toString()}
    popupJS();
    ${campaign.customJS}
  `

  const _getFontValue = (value) => value ? value.substring(value.indexOf("'") + 1, value.lastIndexOf("'")) : '';

  const _getGoogleFontValue = (value) => _getFontValue(value).replace(' ', '+');

  const campaignMobileCSS = `
    #salestorm-product {
      flex-direction: column !important;
      padding: 15px !important;
      padding-bottom: 0px !important;
    }
    #salestorm-product-image {
      padding-top: 120px !important;
    }
    #salestorm-product-image-container {
      width: 100% !important;
      height: 120px !important;
    }
    #salestorm-product-action-container {
      width: 100% !important;
      height: initial !important;
      padding-bottom: 0px !important;
    }
    #salestorm-product-action-container > * {
      margin-bottom: 5px !important;
    }
    #salestorm-product-action-container > button {
      margin-top: 8px !important;
      margin-bottom: 8px !important;
    }
    #salestorm-product-action-container > p {
      margin-bottom: 5px !important;
      margin-top: 5px !important;
    }
    #salestorm-popup-footer-close-action {
      display: none !important;
    }
    #salestorm-popup-footer-checkout-action {
      margin: 0 auto !important;
      font-size: 16px !important;
    }
    #salestorm-popup-header-title {
      max-width: 75%;
    }
    #salestorm-overlay-container {
      contain: layout;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      width: 100% !important;
      height: 100% !important;
      z-index: 99999 !important;
      ${styleObjectToStyleString(campaign.mobileStyles.overlay)};
    }
    #salestorm-popup {
      contain: layout;
      z-index: 100000 !important;
      max-height: 100% !important;
      ${styleObjectToStyleString(campaign.mobileStyles.popup)};
    }
    #salestorm-popup-close {
      contain: layout;
      ${styleObjectToStyleString(campaign.mobileStyles.secondaryButtons)};
    }
    #salestorm-add-to-cart-button {
      ${styleObjectToStyleString(campaign.mobileStyles.primaryButtons)};
    }
  `

  const campaignCSS = `
    ${
      !styles.popup.fontFamily.includes('Arial') ? `@import url('https://fonts.googleapis.com/css2?family=${_getGoogleFontValue(styles.popup.fontFamily)}');` : ''
    }
    ${
      !styles.primaryButtons.fontFamily.includes('Arial') ? `@import url('https://fonts.googleapis.com/css2?family=${_getGoogleFontValue(styles.primaryButtons.fontFamily)}');` : ''
    }
    :root{--animate-duration:1s;--animate-delay:1s;--animate-repeat:1}.animate__animated{-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-duration:var(--animate-duration);animation-duration:var(--animate-duration);-webkit-animation-fill-mode:both;animation-fill-mode:both}.animate__animated.animate__infinite{-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.animate__animated.animate__repeat-1{-webkit-animation-iteration-count:1;animation-iteration-count:1;-webkit-animation-iteration-count:var(--animate-repeat);animation-iteration-count:var(--animate-repeat)}.animate__animated.animate__repeat-2{-webkit-animation-iteration-count:2;animation-iteration-count:2;-webkit-animation-iteration-count:calc(var(--animate-repeat)*2);animation-iteration-count:calc(var(--animate-repeat)*2)}.animate__animated.animate__repeat-3{-webkit-animation-iteration-count:3;animation-iteration-count:3;-webkit-animation-iteration-count:calc(var(--animate-repeat)*3);animation-iteration-count:calc(var(--animate-repeat)*3)}.animate__animated.animate__delay-1s{-webkit-animation-delay:1s;animation-delay:1s;-webkit-animation-delay:var(--animate-delay);animation-delay:var(--animate-delay)}.animate__animated.animate__delay-2s{-webkit-animation-delay:2s;animation-delay:2s;-webkit-animation-delay:calc(var(--animate-delay)*2);animation-delay:calc(var(--animate-delay)*2)}.animate__animated.animate__delay-3s{-webkit-animation-delay:3s;animation-delay:3s;-webkit-animation-delay:calc(var(--animate-delay)*3);animation-delay:calc(var(--animate-delay)*3)}.animate__animated.animate__delay-4s{-webkit-animation-delay:4s;animation-delay:4s;-webkit-animation-delay:calc(var(--animate-delay)*4);animation-delay:calc(var(--animate-delay)*4)}.animate__animated.animate__delay-5s{-webkit-animation-delay:5s;animation-delay:5s;-webkit-animation-delay:calc(var(--animate-delay)*5);animation-delay:calc(var(--animate-delay)*5)}.animate__animated.animate__faster{-webkit-animation-duration:.5s;animation-duration:.5s;-webkit-animation-duration:calc(var(--animate-duration)/2);animation-duration:calc(var(--animate-duration)/2)}.animate__animated.animate__fast{-webkit-animation-duration:.8s;animation-duration:.8s;-webkit-animation-duration:calc(var(--animate-duration)*0.8);animation-duration:calc(var(--animate-duration)*0.8)}.animate__animated.animate__slow{-webkit-animation-duration:2s;animation-duration:2s;-webkit-animation-duration:calc(var(--animate-duration)*2);animation-duration:calc(var(--animate-duration)*2)}.animate__animated.animate__slower{-webkit-animation-duration:3s;animation-duration:3s;-webkit-animation-duration:calc(var(--animate-duration)*3);animation-duration:calc(var(--animate-duration)*3)}@media (prefers-reduced-motion:reduce),print{.animate__animated{-webkit-animation-duration:1ms!important;animation-duration:1ms!important;-webkit-transition-duration:1ms!important;transition-duration:1ms!important;-webkit-animation-iteration-count:1!important;animation-iteration-count:1!important}.animate__animated[class*=Out]{opacity:0}}@-webkit-keyframes backInDown{0%{-webkit-transform:translateY(-1200px) scale(.7);transform:translateY(-1200px) scale(.7);opacity:.7}80%{-webkit-transform:translateY(0) scale(.7);transform:translateY(0) scale(.7);opacity:.7}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes backInDown{0%{-webkit-transform:translateY(-1200px) scale(.7);transform:translateY(-1200px) scale(.7);opacity:.7}80%{-webkit-transform:translateY(0) scale(.7);transform:translateY(0) scale(.7);opacity:.7}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}.animate__backInDown{-webkit-animation-name:backInDown;animation-name:backInDown}@-webkit-keyframes backInUp{0%{-webkit-transform:translateY(1200px) scale(.7);transform:translateY(1200px) scale(.7);opacity:.7}80%{-webkit-transform:translateY(0) scale(.7);transform:translateY(0) scale(.7);opacity:.7}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes backInUp{0%{-webkit-transform:translateY(1200px) scale(.7);transform:translateY(1200px) scale(.7);opacity:.7}80%{-webkit-transform:translateY(0) scale(.7);transform:translateY(0) scale(.7);opacity:.7}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}.animate__backInUp{-webkit-animation-name:backInUp;animation-name:backInUp}@-webkit-keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.animate__fadeIn{-webkit-animation-name:fadeIn;animation-name:fadeIn}@-webkit-keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__fadeInDown{-webkit-animation-name:fadeInDown;animation-name:fadeInDown}@-webkit-keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__fadeInUp{-webkit-animation-name:fadeInUp;animation-name:fadeInUp}@-webkit-keyframes flipInX{0%{-webkit-transform:perspective(400px) rotateX(90deg);transform:perspective(400px) rotateX(90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotateX(-20deg);transform:perspective(400px) rotateX(-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotateX(10deg);transform:perspective(400px) rotateX(10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotateX(-5deg);transform:perspective(400px) rotateX(-5deg)}to{-webkit-transform:perspective(400px);transform:perspective(400px)}}@keyframes flipInX{0%{-webkit-transform:perspective(400px) rotateX(90deg);transform:perspective(400px) rotateX(90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotateX(-20deg);transform:perspective(400px) rotateX(-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotateX(10deg);transform:perspective(400px) rotateX(10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotateX(-5deg);transform:perspective(400px) rotateX(-5deg)}to{-webkit-transform:perspective(400px);transform:perspective(400px)}}.animate__flipInX{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipInX;animation-name:flipInX}@-webkit-keyframes flipInY{0%{-webkit-transform:perspective(400px) rotateY(90deg);transform:perspective(400px) rotateY(90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotateY(-20deg);transform:perspective(400px) rotateY(-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotateY(10deg);transform:perspective(400px) rotateY(10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotateY(-5deg);transform:perspective(400px) rotateY(-5deg)}to{-webkit-transform:perspective(400px);transform:perspective(400px)}}@keyframes flipInY{0%{-webkit-transform:perspective(400px) rotateY(90deg);transform:perspective(400px) rotateY(90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotateY(-20deg);transform:perspective(400px) rotateY(-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotateY(10deg);transform:perspective(400px) rotateY(10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotateY(-5deg);transform:perspective(400px) rotateY(-5deg)}to{-webkit-transform:perspective(400px);transform:perspective(400px)}}.animate__flipInY{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipInY;animation-name:flipInY}@-webkit-keyframes lightSpeedInRight{0%{-webkit-transform:translate3d(100%,0,0) skewX(-30deg);transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes lightSpeedInRight{0%{-webkit-transform:translate3d(100%,0,0) skewX(-30deg);transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__lightSpeedInRight{-webkit-animation-name:lightSpeedInRight;animation-name:lightSpeedInRight;-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}@-webkit-keyframes lightSpeedInLeft{0%{-webkit-transform:translate3d(-100%,0,0) skewX(30deg);transform:translate3d(-100%,0,0) skewX(30deg);opacity:0}60%{-webkit-transform:skewX(-20deg);transform:skewX(-20deg);opacity:1}80%{-webkit-transform:skewX(5deg);transform:skewX(5deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes lightSpeedInLeft{0%{-webkit-transform:translate3d(-100%,0,0) skewX(30deg);transform:translate3d(-100%,0,0) skewX(30deg);opacity:0}60%{-webkit-transform:skewX(-20deg);transform:skewX(-20deg);opacity:1}80%{-webkit-transform:skewX(5deg);transform:skewX(5deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__lightSpeedInLeft{-webkit-animation-name:lightSpeedInLeft;animation-name:lightSpeedInLeft;-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}@-webkit-keyframes rotateIn{0%{-webkit-transform:rotate(-200deg);transform:rotate(-200deg);opacity:0}to{-webkit-transform:translateZ(0);transform:translateZ(0);opacity:1}}@keyframes rotateIn{0%{-webkit-transform:rotate(-200deg);transform:rotate(-200deg);opacity:0}to{-webkit-transform:translateZ(0);transform:translateZ(0);opacity:1}}.animate__rotateIn{-webkit-animation-name:rotateIn;animation-name:rotateIn;-webkit-transform-origin:center;transform-origin:center}@-webkit-keyframes jackInTheBox{0%{opacity:0;-webkit-transform:scale(.1) rotate(30deg);transform:scale(.1) rotate(30deg);-webkit-transform-origin:center bottom;transform-origin:center bottom}50%{-webkit-transform:rotate(-10deg);transform:rotate(-10deg)}70%{-webkit-transform:rotate(3deg);transform:rotate(3deg)}to{opacity:1;-webkit-transform:scale(1);transform:scale(1)}}@keyframes jackInTheBox{0%{opacity:0;-webkit-transform:scale(.1) rotate(30deg);transform:scale(.1) rotate(30deg);-webkit-transform-origin:center bottom;transform-origin:center bottom}50%{-webkit-transform:rotate(-10deg);transform:rotate(-10deg)}70%{-webkit-transform:rotate(3deg);transform:rotate(3deg)}to{opacity:1;-webkit-transform:scale(1);transform:scale(1)}}.animate__jackInTheBox{-webkit-animation-name:jackInTheBox;animation-name:jackInTheBox}@-webkit-keyframes rollIn{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0) rotate(-120deg);transform:translate3d(-100%,0,0) rotate(-120deg)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes rollIn{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0) rotate(-120deg);transform:translate3d(-100%,0,0) rotate(-120deg)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__rollIn{-webkit-animation-name:rollIn;animation-name:rollIn}@-webkit-keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}50%{opacity:1}}@keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}50%{opacity:1}}.animate__zoomIn{-webkit-animation-name:zoomIn;animation-name:zoomIn}
    body {
      margin: 0px;
      padding: 0px;
    }
    *:focus {
      outline: none;
    }
    #salestorm-overlay-container p {
      margin: 0px;
      padding: 0px;
    }
    #salestorm-overlay-container {
      contain: layout;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      z-index: 99999;
      transition: 0.25s ease;
      ${styleObjectToStyleString(styles.overlay)};
    }
    #salestorm-popup {
      contain: layout;
      z-index: 100000;
      transition: 0.25s ease;
      ${styleObjectToStyleString(styles.popup)};
    }
    #salestorm-popup-close {
      contain: layout;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.25s ease;
      ${styleObjectToStyleString(styles.secondaryButtons)};
    }
    #salestorm-popup-close > span {
      width: 1.5rem;
      height: 1.5rem;
    }
    #salestorm-popup-close > span > svg {
      width: 100%;
    }
    #salestorm-popup-close:hover {
      fill: ${tinycolor(styles.secondaryButtons.fill).darken(20)};
    }
    #salestorm-popup-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
    }
    #salestorm-popup-header-title {
      font-size: 23px;
      max-width: 75%;
    }
    #salestorm-popup-footer {
      width: 100%;
      bottom: 0px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
    }
    #salestorm-popup-footer-close-action {
      cursor: pointer;
    }
    #salestorm-popup-footer-checkout-action {
      cursor: pointer;
    }
    #salestorm-product {
      padding: 30px;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
    }
    #salestorm-product-image-container {
      width: 254px;
      height: 254px;
    }
    #salestorm-product-image {
      padding-top: 254px;
      border-radius: 4px;
      background-image: url(${campaignProductImage});
      background-size: cover;
      background-position: center;
    }
    #salestorm-product-action-container {
      width: 254px;
      height: 254px;
      padding: 16px;
      text-align: center;
    }
    #salestorm-product-action-container > h3 {
      font-size: 23px;
      font-weight: bold;
    }
    #salestorm-product-action-container > * {
      margin-bottom: 16px;
    }
    #salestorm-product-action-container > button {
      margin-bottom: 16px;
    }
    #salestorm-product-action-container > p {
      margin-bottom: 16px;
    }
    .salestorm-product-select {
      padding: 8px 16px !important;
      background-color: ${tinycolor(styles.popup.backgroundColor).darken(20)};
      width: 100% !important;
      border-radius: 3px;
      border-color: inherit;
      text-indent: 0.01px;
      cursor: pointer;
      appearance: none;
      color: inherit;
      font-family: inherit;
      margin-bottom: 16px;
    }
    #salestorm-add-to-cart-button {
      width: 100% !important;
      color: inherit;
      padding: 16px 24px !important;
      font-size: 17px;
      font-weight: bold;
      cursor: pointer;
      transition: 0.25s ease;
      ${styleObjectToStyleString(campaign.styles.primaryButtons)};
    }
    #salestorm-add-to-cart-button:hover {
      background-color: ${tinycolor(styles.primaryButtons.backgroundColor).darken(20)};
    }
    #salestorm-product-details-message{
      color: inherit;
      text-decoration: underline;
      cursor: pointer;
    }
    ${isPreviewDesktop ? '' : campaignMobileCSS}
    @media only screen and (max-width: 750px) {
      ${campaignMobileCSS}
    }
    ${campaign.customCSS}
  `;

  return (
    <div id='salestorm-upselling-container'>
      <style>
        {
          campaignCSS
        }
      </style>
      <div className={mobileContainerClass}>
        <div id="salestorm-overlay-container">
          <div id='salestorm-popup' className={`animate__animated ${campaign.animation.type} animate__delay-${campaign.animation.delay}s animate__${campaign.animation.speed}`}>
            <div id='salestorm-popup-header'>
              <div id='salestorm-popup-header-title'>
                {
                  campaignProductTitle
                }
              </div>
              <div id='salestorm-popup-close'>
                <Icon source={MobileCancelMajor} />
              </div>
            </div>
            <div id='salestorm-product'>
              <div id='salestorm-product-image-container'>
                <div id='salestorm-product-image'/>
              </div>
              <div id='salestorm-product-action-container'>
                {
                  campaignProduct && (
                    <>
                      <h3>GET {campaignDiscount} DISCOUNT!</h3>
                      <p>Get this product with a {campaignDiscount} Discount.</p>
                      <select className='salestorm-product-select'>
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                      </select>
                      <button id='salestorm-add-to-cart-button'>
                        Claim Offer!
                      </button>
                      <p id='salestorm-product-details-message'>See product details</p>
                    </>
                  )
                }
              </div>
            </div>
            <div id='salestorm-popup-footer'>
              <div id='salestorm-popup-footer-close-action'>
                No thanks
              </div>
              <div id='salestorm-popup-footer-checkout-action'>
                Go to checkout &#8594;
              </div>
            </div>
          </div>
        </div>
      </div>
      <script type='text/javascript'>
        {
          popupJS()
        }
        {
          campaignJS
        }
      </script>
    </div>
  );
};

export default CampaignPreview;

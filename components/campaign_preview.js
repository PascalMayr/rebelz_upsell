import React from 'react';
import { kebabCasify } from 'casify';
import '../styles/components_campaign_preview.css';

const CampaignPreview = ({
  campaign,
  isPreviewDesktop,
  setCampaignProperty,
}) => {
  const styles = isPreviewDesktop ? campaign.styles : campaign.mobileStyles;
  const mobileContainerClass = !isPreviewDesktop ? 'salestorm-mobile-preview-container' : '';
  const campaignMessageKey = isPreviewDesktop ? 'message' : 'mobileMessage';
  const styleObjectToStyleString = (styleObject) => {
    const kebabCaseStyles = kebabCasify(styleObject);
    return Object.keys(kebabCaseStyles).map(styleKey => `${styleKey}: ${kebabCaseStyles[styleKey]}`).join(';');
  }

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
    @import url('https://fonts.googleapis.com/css2?family=${_getGoogleFontValue(styles.popup.fontFamily)}');
    @import url('https://fonts.googleapis.com/css2?family=${_getGoogleFontValue(styles.primaryButtons.fontFamily)}');
    :root{--animate-duration:1s;--animate-delay:1s;--animate-repeat:1}.animate__animated{-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-duration:var(--animate-duration);animation-duration:var(--animate-duration);-webkit-animation-fill-mode:both;animation-fill-mode:both}.animate__animated.animate__infinite{-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.animate__animated.animate__repeat-1{-webkit-animation-iteration-count:1;animation-iteration-count:1;-webkit-animation-iteration-count:var(--animate-repeat);animation-iteration-count:var(--animate-repeat)}.animate__animated.animate__repeat-2{-webkit-animation-iteration-count:2;animation-iteration-count:2;-webkit-animation-iteration-count:calc(var(--animate-repeat)*2);animation-iteration-count:calc(var(--animate-repeat)*2)}.animate__animated.animate__repeat-3{-webkit-animation-iteration-count:3;animation-iteration-count:3;-webkit-animation-iteration-count:calc(var(--animate-repeat)*3);animation-iteration-count:calc(var(--animate-repeat)*3)}.animate__animated.animate__delay-1s{-webkit-animation-delay:1s;animation-delay:1s;-webkit-animation-delay:var(--animate-delay);animation-delay:var(--animate-delay)}.animate__animated.animate__delay-2s{-webkit-animation-delay:2s;animation-delay:2s;-webkit-animation-delay:calc(var(--animate-delay)*2);animation-delay:calc(var(--animate-delay)*2)}.animate__animated.animate__delay-3s{-webkit-animation-delay:3s;animation-delay:3s;-webkit-animation-delay:calc(var(--animate-delay)*3);animation-delay:calc(var(--animate-delay)*3)}.animate__animated.animate__delay-4s{-webkit-animation-delay:4s;animation-delay:4s;-webkit-animation-delay:calc(var(--animate-delay)*4);animation-delay:calc(var(--animate-delay)*4)}.animate__animated.animate__delay-5s{-webkit-animation-delay:5s;animation-delay:5s;-webkit-animation-delay:calc(var(--animate-delay)*5);animation-delay:calc(var(--animate-delay)*5)}.animate__animated.animate__faster{-webkit-animation-duration:.5s;animation-duration:.5s;-webkit-animation-duration:calc(var(--animate-duration)/2);animation-duration:calc(var(--animate-duration)/2)}.animate__animated.animate__fast{-webkit-animation-duration:.8s;animation-duration:.8s;-webkit-animation-duration:calc(var(--animate-duration)*0.8);animation-duration:calc(var(--animate-duration)*0.8)}.animate__animated.animate__slow{-webkit-animation-duration:2s;animation-duration:2s;-webkit-animation-duration:calc(var(--animate-duration)*2);animation-duration:calc(var(--animate-duration)*2)}.animate__animated.animate__slower{-webkit-animation-duration:3s;animation-duration:3s;-webkit-animation-duration:calc(var(--animate-duration)*3);animation-duration:calc(var(--animate-duration)*3)}@media (prefers-reduced-motion:reduce),print{.animate__animated{-webkit-animation-duration:1ms!important;animation-duration:1ms!important;-webkit-transition-duration:1ms!important;transition-duration:1ms!important;-webkit-animation-iteration-count:1!important;animation-iteration-count:1!important}.animate__animated[class*=Out]{opacity:0}}@-webkit-keyframes backInDown{0%{-webkit-transform:translateY(-1200px) scale(.7);transform:translateY(-1200px) scale(.7);opacity:.7}80%{-webkit-transform:translateY(0) scale(.7);transform:translateY(0) scale(.7);opacity:.7}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes backInDown{0%{-webkit-transform:translateY(-1200px) scale(.7);transform:translateY(-1200px) scale(.7);opacity:.7}80%{-webkit-transform:translateY(0) scale(.7);transform:translateY(0) scale(.7);opacity:.7}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}.animate__backInDown{-webkit-animation-name:backInDown;animation-name:backInDown}@-webkit-keyframes backInUp{0%{-webkit-transform:translateY(1200px) scale(.7);transform:translateY(1200px) scale(.7);opacity:.7}80%{-webkit-transform:translateY(0) scale(.7);transform:translateY(0) scale(.7);opacity:.7}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes backInUp{0%{-webkit-transform:translateY(1200px) scale(.7);transform:translateY(1200px) scale(.7);opacity:.7}80%{-webkit-transform:translateY(0) scale(.7);transform:translateY(0) scale(.7);opacity:.7}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}.animate__backInUp{-webkit-animation-name:backInUp;animation-name:backInUp}@-webkit-keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.animate__fadeIn{-webkit-animation-name:fadeIn;animation-name:fadeIn}@-webkit-keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__fadeInDown{-webkit-animation-name:fadeInDown;animation-name:fadeInDown}@-webkit-keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__fadeInUp{-webkit-animation-name:fadeInUp;animation-name:fadeInUp}@-webkit-keyframes flipInX{0%{-webkit-transform:perspective(400px) rotateX(90deg);transform:perspective(400px) rotateX(90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotateX(-20deg);transform:perspective(400px) rotateX(-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotateX(10deg);transform:perspective(400px) rotateX(10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotateX(-5deg);transform:perspective(400px) rotateX(-5deg)}to{-webkit-transform:perspective(400px);transform:perspective(400px)}}@keyframes flipInX{0%{-webkit-transform:perspective(400px) rotateX(90deg);transform:perspective(400px) rotateX(90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotateX(-20deg);transform:perspective(400px) rotateX(-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotateX(10deg);transform:perspective(400px) rotateX(10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotateX(-5deg);transform:perspective(400px) rotateX(-5deg)}to{-webkit-transform:perspective(400px);transform:perspective(400px)}}.animate__flipInX{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipInX;animation-name:flipInX}@-webkit-keyframes flipInY{0%{-webkit-transform:perspective(400px) rotateY(90deg);transform:perspective(400px) rotateY(90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotateY(-20deg);transform:perspective(400px) rotateY(-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotateY(10deg);transform:perspective(400px) rotateY(10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotateY(-5deg);transform:perspective(400px) rotateY(-5deg)}to{-webkit-transform:perspective(400px);transform:perspective(400px)}}@keyframes flipInY{0%{-webkit-transform:perspective(400px) rotateY(90deg);transform:perspective(400px) rotateY(90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotateY(-20deg);transform:perspective(400px) rotateY(-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotateY(10deg);transform:perspective(400px) rotateY(10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotateY(-5deg);transform:perspective(400px) rotateY(-5deg)}to{-webkit-transform:perspective(400px);transform:perspective(400px)}}.animate__flipInY{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipInY;animation-name:flipInY}@-webkit-keyframes lightSpeedInRight{0%{-webkit-transform:translate3d(100%,0,0) skewX(-30deg);transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes lightSpeedInRight{0%{-webkit-transform:translate3d(100%,0,0) skewX(-30deg);transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__lightSpeedInRight{-webkit-animation-name:lightSpeedInRight;animation-name:lightSpeedInRight;-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}@-webkit-keyframes lightSpeedInLeft{0%{-webkit-transform:translate3d(-100%,0,0) skewX(30deg);transform:translate3d(-100%,0,0) skewX(30deg);opacity:0}60%{-webkit-transform:skewX(-20deg);transform:skewX(-20deg);opacity:1}80%{-webkit-transform:skewX(5deg);transform:skewX(5deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes lightSpeedInLeft{0%{-webkit-transform:translate3d(-100%,0,0) skewX(30deg);transform:translate3d(-100%,0,0) skewX(30deg);opacity:0}60%{-webkit-transform:skewX(-20deg);transform:skewX(-20deg);opacity:1}80%{-webkit-transform:skewX(5deg);transform:skewX(5deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__lightSpeedInLeft{-webkit-animation-name:lightSpeedInLeft;animation-name:lightSpeedInLeft;-webkit-animation-timing-functio
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
          >
            <br />
      <style>
        {
          campaignCSS
        }
      </style>
          <div id='salestorm-popup' className={`animate__animated ${campaign.animation} animate__delay-${campaign.animation_delay}s`}>
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

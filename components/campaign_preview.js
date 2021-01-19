import { useEffect } from 'react';
import { kebabCasify } from 'casify';
import '../styles/components_campaign_preview.css';
import { MobileCancelMajor, SelectMinor } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';
import tinycolor from 'tinycolor2';

const CampaignPreview = ({ campaign: { styles }, campaign, preview }) => {

  const styleObjectToStyleString = (styleObject) => {
    const kebabCaseStyles = kebabCasify(styleObject);
    return Object.keys(kebabCaseStyles)
      .map((styleKey) => `${styleKey}: ${kebabCaseStyles[styleKey]}`)
      .join(';');
  };

  const renderedProductVariantsByOption = {};
  const renderedProduct = campaign.products.selling[0];
  if (renderedProduct) {
    renderedProduct.variants.edges.forEach((edge) => {
      const variant = edge.node;
      edge.node.selectedOptions.forEach((selectedOption) => {
        let currentSelectedOption = renderedProductVariantsByOption[selectedOption.name];
        if (currentSelectedOption) {
          currentSelectedOption.push(variant);
        } else {
          currentSelectedOption = [variant];
        }
        renderedProductVariantsByOption[selectedOption.name] = currentSelectedOption;
      });
    });
  }

  const campaignJS = `
    try {
      if(typeof document !== 'undefined') {
        const productDetailsMessage = document.querySelector('#salestorm-product-details-message');
        productDetailsMessage && productDetailsMessage.addEventListener('click', () => {
          document.querySelector('#salestorm-product').style.paddingBottom = '0px';
          document.querySelector('#salestorm-product-description').style.display = 'block';
        });
        const hidePopup = () => document.querySelector('#salestorm-upselling-container').style.display = 'none';
        const closeButton = document.querySelector('#salestorm-popup-close');
        closeButton.addEventListener('click', () => {
          hidePopup();
        });
        const closeAction = document.querySelector('#salestorm-popup-footer-close-action');
        closeAction.addEventListener('click', () => {
          hidePopup();
        });
      }
    }
    catch(error) {
      console.log('%cA Salestorm Javascript Error occured', 'color: orange;');
      console.log(error);
    }
  `;

  /* Will be just executed once in the Preview */
  useEffect(() => {
    try {
      eval(campaignJS);
    }
    catch (error) {
      console.log('%cA Salestorm Javascript Error occured in the preview', 'color: orange;');
      console.log(error);
    }
  }, [campaign]);

  const customJS = `
    try {
      ${campaign.customJS}
    }
    catch(error) {
      console.log('%cA Salestorm Javascript Error occured', 'color: orange;');
      console.log(error);
    }
  `;

  /* Will be executed on every campaign.customJS updated */
  useEffect(() => {
    try {
      eval(customJS);
    }
    catch (error) {
      console.log('%cA Salestorm Javascript Error occured in the preview', 'color: orange;');
      console.log(error);
    }
  }, [customJS]);

  const _getFontValue = (value) =>
    value
      ? value.substring(value.indexOf("'") + 1, value.lastIndexOf("'"))
      : '';

  const _getGoogleFontValue = (value) => _getFontValue(value).replace(' ', '+');


  const campaignMobileCSS = `
    #salestorm-product {
      flex-direction: column !important;
      padding: 8px !important;
      padding-bottom: 0px !important;
    }
    #salestorm-product-image {
      padding-top: 200px !important;
    }
    #salestorm-product-image-container {
      width: 100% !important;
      height: 200px !important;
    }
  `;

  const campaignTabletCSS = `
    #salestorm-product {
      flex-direction: column !important;
      padding: 24px !important;
      padding-bottom: 0px !important;
    }
    #salestorm-product-image {
      padding-top: 300px !important;
    }
    #salestorm-product-image-container {
      width: 100% !important;
      height: 300px !important;
    }
    #salestorm-product-action-container {
      width: 100% !important;
      height: initial !important;
      padding-top: 16px !important;
    }
    #salestorm-product-action-container > h3 {
      font-size: 18px !important;
    }
    #salestorm-product-action-container > * {
      margin-bottom: 10px !important;
    }
    #salestorm-product-action-container > button {
      margin-top: 8px !important;
      margin-bottom: 8px !important;
    }
    #salestorm-product-action-container > p {
      margin-bottom: 10px !important;
      margin-top: 10px !important;
    }
    #salestorm-popup-footer-close-action {
      display: none !important;
    }
    #salestorm-popup-footer-checkout-action {
      margin: 0 auto !important;
      font-size: 16px !important;
    }
    #salestorm-popup-header-title {
      max-width: 75% !important;
    }
    #salestorm-product-description {
      padding: 0px 16px !important;
      margin-top: 6px !important;
      text-align: center !important;
    }
    #salestorm-overlay-container {
      contain: layout;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      width: 100% !important;
      height: 100% !important;
      z-index: 99999 !important;
    }
    #salestorm-popup {
      contain: layout;
      z-index: 100000 !important;
      max-height: 100% !important;
      width: 100% !important;
      -webkit-tap-highlight-color: ${tinycolor(
        styles.popup.backgroundColor
      ).lighten(10)};
    }
  `;

  const campaignCSS = `
    ${
      !styles.popup.fontFamily.includes('Arial')
        ? `@import url('https://fonts.googleapis.com/css2?family=${_getGoogleFontValue(
            styles.popup.fontFamily
          )}');`
        : ''
    }
    ${
      !styles.primaryButtons.fontFamily.includes('Arial')
        ? `@import url('https://fonts.googleapis.com/css2?family=${_getGoogleFontValue(
            styles.primaryButtons.fontFamily
          )}');`
        : ''
    }
    :root{--animate-duration:1s;--animate-delay:1s;--animate-repeat:1}.animate__animated{-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-duration:var(--animate-duration);animation-duration:var(--animate-duration);-webkit-animation-fill-mode:both;animation-fill-mode:both}.animate__animated.animate__infinite{-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.animate__animated.animate__repeat-1{-webkit-animation-iteration-count:1;animation-iteration-count:1;-webkit-animation-iteration-count:var(--animate-repeat);animation-iteration-count:var(--animate-repeat)}.animate__animated.animate__repeat-2{-webkit-animation-iteration-count:2;animation-iteration-count:2;-webkit-animation-iteration-count:calc(var(--animate-repeat)*2);animation-iteration-count:calc(var(--animate-repeat)*2)}.animate__animated.animate__repeat-3{-webkit-animation-iteration-count:3;animation-iteration-count:3;-webkit-animation-iteration-count:calc(var(--animate-repeat)*3);animation-iteration-count:calc(var(--animate-repeat)*3)}.animate__animated.animate__delay-1s{-webkit-animation-delay:1s;animation-delay:1s;-webkit-animation-delay:var(--animate-delay);animation-delay:var(--animate-delay)}.animate__animated.animate__delay-2s{-webkit-animation-delay:2s;animation-delay:2s;-webkit-animation-delay:calc(var(--animate-delay)*2);animation-delay:calc(var(--animate-delay)*2)}.animate__animated.animate__delay-3s{-webkit-animation-delay:3s;animation-delay:3s;-webkit-animation-delay:calc(var(--animate-delay)*3);animation-delay:calc(var(--animate-delay)*3)}.animate__animated.animate__delay-4s{-webkit-animation-delay:4s;animation-delay:4s;-webkit-animation-delay:calc(var(--animate-delay)*4);animation-delay:calc(var(--animate-delay)*4)}.animate__animated.animate__delay-5s{-webkit-animation-delay:5s;animation-delay:5s;-webkit-animation-delay:calc(var(--animate-delay)*5);animation-delay:calc(var(--animate-delay)*5)}.animate__animated.animate__faster{-webkit-animation-duration:.5s;animation-duration:.5s;-webkit-animation-duration:calc(var(--animate-duration)/2);animation-duration:calc(var(--animate-duration)/2)}.animate__animated.animate__fast{-webkit-animation-duration:.8s;animation-duration:.8s;-webkit-animation-duration:calc(var(--animate-duration)*0.8);animation-duration:calc(var(--animate-duration)*0.8)}.animate__animated.animate__slow{-webkit-animation-duration:2s;animation-duration:2s;-webkit-animation-duration:calc(var(--animate-duration)*2);animation-duration:calc(var(--animate-duration)*2)}.animate__animated.animate__slower{-webkit-animation-duration:3s;animation-duration:3s;-webkit-animation-duration:calc(var(--animate-duration)*3);animation-duration:calc(var(--animate-duration)*3)}@media (prefers-reduced-motion:reduce),print{.animate__animated{-webkit-animation-duration:1ms!important;animation-duration:1ms!important;-webkit-transition-duration:1ms!important;transition-duration:1ms!important;-webkit-animation-iteration-count:1!important;animation-iteration-count:1!important}.animate__animated[class*=Out]{opacity:0}}@-webkit-keyframes backInDown{0%{-webkit-transform:translateY(-1200px) scale(.7);transform:translateY(-1200px) scale(.7);opacity:.7}80%{-webkit-transform:translateY(0) scale(.7);transform:translateY(0) scale(.7);opacity:.7}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes backInDown{0%{-webkit-transform:translateY(-1200px) scale(.7);transform:translateY(-1200px) scale(.7);opacity:.7}80%{-webkit-transform:translateY(0) scale(.7);transform:translateY(0) scale(.7);opacity:.7}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}.animate__backInDown{-webkit-animation-name:backInDown;animation-name:backInDown}@-webkit-keyframes backInUp{0%{-webkit-transform:translateY(1200px) scale(.7);transform:translateY(1200px) scale(.7);opacity:.7}80%{-webkit-transform:translateY(0) scale(.7);transform:translateY(0) scale(.7);opacity:.7}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes backInUp{0%{-webkit-transform:translateY(1200px) scale(.7);transform:translateY(1200px) scale(.7);opacity:.7}80%{-webkit-transform:translateY(0) scale(.7);transform:translateY(0) scale(.7);opacity:.7}to{-webkit-transform:scale(1);transform:scale(1);opacity:1}}.animate__backInUp{-webkit-animation-name:backInUp;animation-name:backInUp}@-webkit-keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.animate__fadeIn{-webkit-animation-name:fadeIn;animation-name:fadeIn}@-webkit-keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__fadeInDown{-webkit-animation-name:fadeInDown;animation-name:fadeInDown}@-webkit-keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__fadeInUp{-webkit-animation-name:fadeInUp;animation-name:fadeInUp}@-webkit-keyframes flipInX{0%{-webkit-transform:perspective(400px) rotateX(90deg);transform:perspective(400px) rotateX(90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotateX(-20deg);transform:perspective(400px) rotateX(-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotateX(10deg);transform:perspective(400px) rotateX(10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotateX(-5deg);transform:perspective(400px) rotateX(-5deg)}to{-webkit-transform:perspective(400px);transform:perspective(400px)}}@keyframes flipInX{0%{-webkit-transform:perspective(400px) rotateX(90deg);transform:perspective(400px) rotateX(90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotateX(-20deg);transform:perspective(400px) rotateX(-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotateX(10deg);transform:perspective(400px) rotateX(10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotateX(-5deg);transform:perspective(400px) rotateX(-5deg)}to{-webkit-transform:perspective(400px);transform:perspective(400px)}}.animate__flipInX{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipInX;animation-name:flipInX}@-webkit-keyframes flipInY{0%{-webkit-transform:perspective(400px) rotateY(90deg);transform:perspective(400px) rotateY(90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotateY(-20deg);transform:perspective(400px) rotateY(-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotateY(10deg);transform:perspective(400px) rotateY(10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotateY(-5deg);transform:perspective(400px) rotateY(-5deg)}to{-webkit-transform:perspective(400px);transform:perspective(400px)}}@keyframes flipInY{0%{-webkit-transform:perspective(400px) rotateY(90deg);transform:perspective(400px) rotateY(90deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in;opacity:0}40%{-webkit-transform:perspective(400px) rotateY(-20deg);transform:perspective(400px) rotateY(-20deg);-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}60%{-webkit-transform:perspective(400px) rotateY(10deg);transform:perspective(400px) rotateY(10deg);opacity:1}80%{-webkit-transform:perspective(400px) rotateY(-5deg);transform:perspective(400px) rotateY(-5deg)}to{-webkit-transform:perspective(400px);transform:perspective(400px)}}.animate__flipInY{-webkit-backface-visibility:visible!important;backface-visibility:visible!important;-webkit-animation-name:flipInY;animation-name:flipInY}@-webkit-keyframes lightSpeedInRight{0%{-webkit-transform:translate3d(100%,0,0) skewX(-30deg);transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes lightSpeedInRight{0%{-webkit-transform:translate3d(100%,0,0) skewX(-30deg);transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{-webkit-transform:skewX(20deg);transform:skewX(20deg);opacity:1}80%{-webkit-transform:skewX(-5deg);transform:skewX(-5deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__lightSpeedInRight{-webkit-animation-name:lightSpeedInRight;animation-name:lightSpeedInRight;-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}@-webkit-keyframes lightSpeedInLeft{0%{-webkit-transform:translate3d(-100%,0,0) skewX(30deg);transform:translate3d(-100%,0,0) skewX(30deg);opacity:0}60%{-webkit-transform:skewX(-20deg);transform:skewX(-20deg);opacity:1}80%{-webkit-transform:skewX(5deg);transform:skewX(5deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes lightSpeedInLeft{0%{-webkit-transform:translate3d(-100%,0,0) skewX(30deg);transform:translate3d(-100%,0,0) skewX(30deg);opacity:0}60%{-webkit-transform:skewX(-20deg);transform:skewX(-20deg);opacity:1}80%{-webkit-transform:skewX(5deg);transform:skewX(5deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__lightSpeedInLeft{-webkit-animation-name:lightSpeedInLeft;animation-name:lightSpeedInLeft;-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}@-webkit-keyframes rotateIn{0%{-webkit-transform:rotate(-200deg);transform:rotate(-200deg);opacity:0}to{-webkit-transform:translateZ(0);transform:translateZ(0);opacity:1}}@keyframes rotateIn{0%{-webkit-transform:rotate(-200deg);transform:rotate(-200deg);opacity:0}to{-webkit-transform:translateZ(0);transform:translateZ(0);opacity:1}}.animate__rotateIn{-webkit-animation-name:rotateIn;animation-name:rotateIn;-webkit-transform-origin:center;transform-origin:center}@-webkit-keyframes jackInTheBox{0%{opacity:0;-webkit-transform:scale(.1) rotate(30deg);transform:scale(.1) rotate(30deg);-webkit-transform-origin:center bottom;transform-origin:center bottom}50%{-webkit-transform:rotate(-10deg);transform:rotate(-10deg)}70%{-webkit-transform:rotate(3deg);transform:rotate(3deg)}to{opacity:1;-webkit-transform:scale(1);transform:scale(1)}}@keyframes jackInTheBox{0%{opacity:0;-webkit-transform:scale(.1) rotate(30deg);transform:scale(.1) rotate(30deg);-webkit-transform-origin:center bottom;transform-origin:center bottom}50%{-webkit-transform:rotate(-10deg);transform:rotate(-10deg)}70%{-webkit-transform:rotate(3deg);transform:rotate(3deg)}to{opacity:1;-webkit-transform:scale(1);transform:scale(1)}}.animate__jackInTheBox{-webkit-animation-name:jackInTheBox;animation-name:jackInTheBox}@-webkit-keyframes rollIn{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0) rotate(-120deg);transform:translate3d(-100%,0,0) rotate(-120deg)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes rollIn{0%{opacity:0;-webkit-transform:translate3d(-100%,0,0) rotate(-120deg);transform:translate3d(-100%,0,0) rotate(-120deg)}to{opacity:1;-webkit-transform:translateZ(0);transform:translateZ(0)}}.animate__rollIn{-webkit-animation-name:rollIn;animation-name:rollIn}@-webkit-keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}50%{opacity:1}}@keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}50%{opacity:1}}.animate__zoomIn{-webkit-animation-name:zoomIn;animation-name:zoomIn}
    body {
      margin: 0px;
      padding: 0px;
      line-height: 2rem;
      text-transform: initial;
      letter-spacing: initial;
    }
    *:focus {
      outline: none;
    }
    #salestorm-upselling-container div {
      box-sizing: border-box;
      font-weight: 400;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }
    #salestorm-upselling-container h3 {
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }
    #salestorm-upselling-container p {
      margin: 0px !important;
      padding: 0px !important;
      font-weight: 400;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }
    #salestorm-overlay-container {
      contain: layout;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      width: 100% !important;
      height: 100% !important;
      z-index: 99999 !important;
      transition: 0.25s ease;
      ${styleObjectToStyleString(styles.overlay)};
    }
    #salestorm-popup::-webkit-scrollbar {
      display: none;
    }
    #salestorm-popup {
      contain: layout;
      z-index: 100000 !important;
      transition: 0.25s ease;
      overflow-y: scroll;
      -ms-overflow-style: none;
      scrollbar-width: none;
      ${styleObjectToStyleString(styles.popup)};
    }
    #salestorm-popup-close {
      contain: layout;
      cursor: pointer !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      transition: 0.25s ease;
      ${styleObjectToStyleString(styles.secondaryButtons)};
    }
    #salestorm-popup-close > span {
      width: 16px !important;
      height: 16px !important;
      margin: 0 auto !important;
    }
    #salestorm-popup-close > span > svg {
      width: 100% !important;
    }
    #salestorm-popup-close:hover {
      background-color: ${tinycolor(
        styles.secondaryButtons.backgroundColor
      ).lighten(10)};
    }
    #salestorm-popup-header {
      width: 100% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 16px !important;
    }
    #salestorm-popup-header-title {
      font-size: 23px !important;
      max-width: 75% !important;
    }
    #salestorm-popup-footer {
      width: 100% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 16px !important;
    }
    #salestorm-popup-footer-close-action {
      cursor: pointer !important;
    }
    #salestorm-popup-footer-checkout-action {
      cursor: pointer !important;
    }
    #salestorm-product {
      padding: 30px;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
    }
    #salestorm-product-image-container {
      width: 254px !important;
      height: 254px !important;
    }
    #salestorm-product-image {
      padding-top: 254px !important;
      border-radius: 4px !important;
      background-color: ${tinycolor(
        styles.popup.backgroundColor
      ).lighten(10)} !important;
      background-image: url(${renderedProduct && renderedProduct.images.edges.length > 0 && renderedProduct.images.edges[0].node.transformedSrc});
      background-size: cover !important;
      background-position: center !important;
    }
    #salestorm-product-action-container {
      width: 254px !important;
      text-align: center !important;
    }
    #salestorm-product-action-container > h3 {
      font-size: 23px !important;
      font-weight: bold !important;
      margin-top: 0px !important;
    }
    #salestorm-product-action-container > * {
      margin-bottom: 16px !important;
    }
    #salestorm-product-action-container > button {
      margin-bottom: 16px !important;
    }
    #salestorm-product-action-container > p {
      margin-bottom: 8px !important;
      font-size: 14px !important;
    }
    .salestorm-product-select-container {
      position: relative !important;
      border-radius: 3px !important;
      border-color: inherit !important;
      border-width: 1px !important;
      border-style: solid;
    }
    .salestorm-product-select {
      padding: 10px 16px !important;
      background-color: ${tinycolor(styles.popup.backgroundColor).darken(10)};
      width: 100% !important;
      border-width: 0px !important;
      text-indent: 0.01px !important;
      cursor: pointer !important;
      appearance: none !important;
      color: inherit !important;
      font-family: inherit !important;
      font-size: 14px !important;
      z-index: 100002 !important;
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
      text-indent: 0.01px;
      text-overflow: '';
    }
    .salestorm-product-select-arrow > span {
      position: absolute !important;
      top: 22% !important;
      right: 5px !important;
      width: 21px !important;
      height: 21px !important;
      fill: ${styles.popup.color} !important;
    }
    #salestorm-claim-offer-button {
      width: 100% !important;
      padding: 16px 24px !important;
      font-size: 17px !important;
      font-weight: bold !important;
      cursor: pointer !important;
      transition: 0.25s ease;
      ${styleObjectToStyleString(campaign.styles.primaryButtons)};
    }
    #salestorm-claim-offer-button:hover {
      background-color: ${tinycolor(
        styles.primaryButtons.backgroundColor
      ).darken(10)} !important;
    }
    #salestorm-product-details-message{
      color: inherit !important;
      text-decoration: underline !important;
      cursor: pointer !important;
    }
    #salestorm-product-description {
      padding: 16px 30px !important;
      display: none;
    }
    ${['tablet', 'mobile'].includes(preview) ? campaignTabletCSS : ''}
    ${preview === 'mobile' ? campaignMobileCSS : ''}
    @media only screen and (max-width: 600px) {
      ${campaignTabletCSS}
    }
    @media only screen and (max-width: 450px) {
      ${campaignMobileCSS}
    }
    ${campaign.customCSS}
  `;

  return (
    <div id="salestorm-upselling-container">
      <style>{campaignCSS}</style>
      <div className={`salestorm-${preview}-preview-container`}>
        <div id="salestorm-overlay-container">
          <div
            id="salestorm-popup"
            className={`animate__animated ${campaign.animation.type} animate__delay-${campaign.animation.delay}s animate__${campaign.animation.speed}`}
          >
            <div id="salestorm-popup-header">
              <div id="salestorm-popup-header-title">
                {renderedProduct && renderedProduct.title}
              </div>
              <div id="salestorm-popup-close">
                <Icon source={MobileCancelMajor} />
              </div>
            </div>
            <div id="salestorm-product">
              <div id="salestorm-product-image-container">
                <div id="salestorm-product-image" />
              </div>
              <div id="salestorm-product-action-container">
                <h3>GET 5% DISCOUNT!</h3>
                <p>Get this product with a 5% Discount.</p>
                {Object.keys(renderedProductVariantsByOption).map((option) => {
                  const productVariants = renderedProductVariantsByOption[option];
                  if (productVariants.length > 1) {
                    return (
                      <div className="salestorm-product-select-container" key={option}>
                        <select
                          className="salestorm-product-select"
                          key={option}
                        >
                          <option selected disabled value={option}>{option}</option>
                          {renderedProductVariantsByOption[option].map((productVariant) => (
                            <option
                              value={productVariant.legacyResourceId}
                              key={productVariant.title}
                            >
                              {productVariant.title}
                            </option>
                          ))}
                        </select>
                        <div className="salestorm-product-select-arrow">
                          <Icon source={SelectMinor} />
                        </div>
                      </div>
                    )
                  }
                  })}
                <button id="salestorm-claim-offer-button">
                  Claim Offer!
                </button>
                {
                  renderedProduct && renderedProduct.descriptionHtml !== '' &&
                  <p id="salestorm-product-details-message">
                    See product details
                  </p>
                }
              </div>
            </div>
            {
              renderedProduct && renderedProduct.descriptionHtml !== '' &&
              <div id="salestorm-product-description" dangerouslySetInnerHTML={{ __html: renderedProduct.descriptionHtml }} />
            }
            <div id="salestorm-popup-footer">
              <div id="salestorm-popup-footer-close-action">No thanks</div>
              <div id="salestorm-popup-footer-checkout-action">
                Go to checkout &#8594;
              </div>
            </div>
          </div>
        </div>
      </div>
      <script type="text/javascript">
        {
          campaignJS
        }
        {
          customJS
        }
      </script>
    </div>
  );
};

export default CampaignPreview;

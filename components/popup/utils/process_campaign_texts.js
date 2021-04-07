const processCampaignTextsUtil = (text) =>
  text
    .replace(
      '{{Discount}}',
      '<span class="salestorm-price salestorm-discount"></span>'
    )
    .replace('{{Countdown}}', '<span id="salestorm-campaign-countdown"></span>')
    .replace(
      '{{ProductPrice}}',
      '<span class="salestorm-price salestorm-product-price"></span>'
    )
    .replace(
      '{{DiscountedProductPrice}}',
      '<span class="salestorm-price salestorm-product-price-discounted"></span>'
    );

export default processCampaignTextsUtil;

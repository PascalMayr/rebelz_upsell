const processCampaignTextsUtil = (text) =>
  text
    .replace(
      '{{Discount}}',
      '<span class="salestorm-price salestorm-discount-value"></span>'
    )
    .replace(
      '{{DiscountedPrice}}',
      '<span class="salestorm-price salestorm-discounted-price"></span>'
    );

export default processCampaignTextsUtil;

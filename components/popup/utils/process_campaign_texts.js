const processCampaignTextsUtil = (text) =>
  text
    .replace(
      '{{Discount}}',
      '<span class="salestorm-price salestorm-discount-value"></span>'
    )
    .replace('{{Countdown}}', '<span class="salestorm-countdown"></span>');

export default processCampaignTextsUtil;

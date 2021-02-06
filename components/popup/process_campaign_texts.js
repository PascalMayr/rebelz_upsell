const processCampaignTextsPopup = (text) =>
  text.replace('{{Discount}}', '<span class="salestorm-price"></span>');

export default processCampaignTextsPopup;

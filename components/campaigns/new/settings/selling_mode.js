import Settings from '.';

const SellingModeSetting = ({ campaign, setCampaignProperty }) => {
  const changeSellingMode = (mode) => {
    setCampaignProperty({ ...campaign.selling, mode }, 'selling');
  };
  return (
    <Settings
      settings={[
        {
          id: 'auto',
          label: 'Let the AI decide',
          name: 'selling',
          onChange: changeSellingMode,
          image: {
            src: '/auto_pilot.svg',
            alt: 'Discount',
            width: '150',
            height: '150',
          },
        },
        {
          id: 'manual',
          label: 'Set products manually',
          name: 'selling',
          onChange: changeSellingMode,
          image: {
            src: '/manual.svg',
            alt: 'Set products',
            width: '150',
            height: '150',
          },
        },
      ]}
      value={campaign.selling.mode}
    />
  );
};

export default SellingModeSetting;

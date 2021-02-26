import { DefaultStateStyle } from '../../../pages/campaigns/new/defaultState';

const GialloBistro = {
  ...DefaultStateStyle,
  popup: {
    ...DefaultStateStyle.popup,
    backgroundColor: 'rgb(250, 243, 236)',
    boxShadow: '0px 0px 5px rgb(224, 181, 129)',
    borderRadius: '15px',
    color: 'rgb(0, 0, 0)',
  },
  primaryButtons: {
    ...DefaultStateStyle.primaryButtons,
    backgroundColor: 'rgb(68, 57, 40)',
  },
  secondaryButtons: {
    ...DefaultStateStyle.secondaryButtons,
    backgroundColor: 'rgb(250, 243, 236)',
    fill: 'rgb(0, 0, 0)',
  },
  animation: {
    ...DefaultStateStyle.animation,
    type: 'animate__rollIn',
  }
};

const Warehouse = {
  ...DefaultStateStyle,
  popup: {
    ...DefaultStateStyle.popup,
    backgroundColor: 'rgb(39, 48, 122)',
    boxShadow: '0px 0px 15px rgb(111, 185, 217)',
    borderRadius: '15px',
    color: 'rgb(255, 255, 255)',
  },
  primaryButtons: {
    ...DefaultStateStyle.primaryButtons,
    backgroundColor: 'rgb(111, 185, 217)',
  },
  secondaryButtons: {
    ...DefaultStateStyle.secondaryButtons,
    backgroundColor: 'rgb(50, 59, 143)',
    fill: 'rgb(255, 255, 255)',
  },
  animation: {
    ...DefaultStateStyle.animation,
    type: 'animate__jackInTheBox',
  }
};

const GalleriaEmpire = {
  ...DefaultStateStyle,
  popup: {
    ...DefaultStateStyle.popup,
    backgroundColor: 'rgb(238, 102, 9)',
    boxShadow: '0px 0px 3px rgb(0, 0, 0)',
    borderRadius: '5px',
    borderWidth: '3px',
    borderColor: 'rgb(255, 255, 255)',
    color: 'rgb(255, 255, 255)',
  },
  primaryButtons: {
    ...DefaultStateStyle.primaryButtons,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: '35px',
    color: 'rgb(247, 114, 22)',
  },
  secondaryButtons: {
    ...DefaultStateStyle.secondaryButtons,
    backgroundColor: 'rgb(238, 102, 9)',
    fill: 'rgb(255, 255, 255)',
  },
  animation: {
    ...DefaultStateStyle.animation,
    type: 'animate__flipInX',
  }
};

const LoftLawrence = {
  ...DefaultStateStyle,
  popup: {
    ...DefaultStateStyle.popup,
    backgroundColor: 'rgb(235, 211, 105)',
    boxShadow: '0px 0px 0px rgb(0, 0, 0)',
    borderRadius: '5px',
    borderWidth: '3px',
    borderColor: 'rgb(0, 0, 0)',
    color: 'rgb(255, 255, 255)',
  },
  primaryButtons: {
    ...DefaultStateStyle.primaryButtons,
    backgroundColor: 'rgb(0, 0, 0)',
    borderRadius: '5px',
    color: 'rgb(255, 255, 255)',
  },
  secondaryButtons: {
    ...DefaultStateStyle.secondaryButtons,
    backgroundColor: 'rgb(235, 211, 105)',
    fill: 'rgb(0, 0, 0)',
  },
  animation: {
    ...DefaultStateStyle.animation,
    type: 'animate__lightSpeedInLeft',
  }
};

const NarrativeCold = {
  ...DefaultStateStyle,
  popup: {
    ...DefaultStateStyle.popup,
    backgroundColor: 'rgb(104, 178, 144)',
    boxShadow: '0px 0px 0px rgb(0, 0, 0)',
    borderRadius: '5px',
    color: 'rgb(0, 0, 0)',
  },
  primaryButtons: {
    ...DefaultStateStyle.primaryButtons,
    backgroundColor: 'rgb(0, 0, 0)',
    borderRadius: '5px',
    color: 'rgb(255, 255, 255)',
  },
  secondaryButtons: {
    ...DefaultStateStyle.secondaryButtons,
    backgroundColor: 'rgb(119, 188, 156)',
    fill: 'rgb(0, 0, 0)',
  },
  animation: {
    ...DefaultStateStyle.animation,
    type: 'animate__backInUp',
  }
};

const quickThemes = (theme) => {
  switch (theme) {
    case 'gialloBistro':
      return GialloBistro;
    case 'warehouse':
      return Warehouse;
    case 'galleriaempire':
      return GalleriaEmpire;
    case 'loftlawrence':
      return LoftLawrence;
    case 'narrativecold':
      return NarrativeCold;
    default:
      return DefaultStateStyle;
  }
}

export default quickThemes;

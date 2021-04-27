import { DefaultStateStyle } from '../../../pages/campaigns/new/defaultState';

const GialloBistro = {
  ...DefaultStateStyle,
  popup: {
    ...DefaultStateStyle.popup,
    backgroundColor: 'rgb(250, 243, 236)',
    boxShadow: '0px 0px 0px rgb(224, 181, 129)',
    borderRadius: '5px',
    color: 'rgb(0, 0, 0)',
    fontFamily: "'Quattrocento', serif",
  },
  primaryButtons: {
    ...DefaultStateStyle.primaryButtons,
    backgroundColor: 'rgb(246, 208, 208)',
  },
  secondaryButtons: {
    ...DefaultStateStyle.secondaryButtons,
    backgroundColor: 'rgb(250, 243, 236)',
    fill: 'rgb(0, 0, 0)',
  },
  animation: {
    ...DefaultStateStyle.animation,
    type: 'animate__fadeIn',
  },
};

const Warehouse = {
  ...DefaultStateStyle,
  popup: {
    ...DefaultStateStyle.popup,
    backgroundColor: 'rgb(39, 48, 122)',
    boxShadow: '0px 0px 0px rgb(111, 185, 217)',
    borderRadius: '5px',
    color: 'rgb(255, 255, 255)',
    fontFamily: "'Montserrat', sans-serif",
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
    type: 'animate__fadeIn',
  },
};

const Supply = {
  ...DefaultStateStyle,
  popup: {
    ...DefaultStateStyle.popup,
    backgroundColor: 'rgb(25, 49, 79)',
    boxShadow: '0px 0px 0px rgb(111, 185, 217)',
    borderRadius: '5px',
    color: 'rgb(255, 255, 255)',
    fontFamily: "'Montserrat', sans-serif",
  },
  primaryButtons: {
    ...DefaultStateStyle.primaryButtons,
    backgroundColor: 'rgb(76, 139, 194)',
  },
  secondaryButtons: {
    ...DefaultStateStyle.secondaryButtons,
    backgroundColor: 'rgb(50, 59, 143)',
    fill: 'rgb(255, 255, 255)',
  },
  animation: {
    ...DefaultStateStyle.animation,
    type: 'animate__fadeIn',
  },
};

const Simple = {
  ...DefaultStateStyle,
  popup: {
    ...DefaultStateStyle.popup,
    backgroundColor: 'rgb(255, 255, 255)',
    boxShadow: '0px 0px 3px rgb(56, 56, 56)',
    borderRadius: '5px',
    color: 'rgb(56, 56, 56)',
    fontFamily: "'Montserrat', sans-serif",
  },
  primaryButtons: {
    ...DefaultStateStyle.primaryButtons,
    backgroundColor: 'rgb(59, 59, 59)',
  },
  secondaryButtons: {
    ...DefaultStateStyle.secondaryButtons,
    backgroundColor: 'rgb(255, 255, 255)',
    fill: 'rgb(56, 56, 56)',
  },
  animation: {
    ...DefaultStateStyle.animation,
    type: 'animate__fadeIn',
  },
};

const Choco = {
  ...DefaultStateStyle,
  popup: {
    ...DefaultStateStyle.popup,
    backgroundColor: 'rgb(104, 63, 57)',
    boxShadow: '0px 0px 0px rgb(56, 56, 56)',
    borderRadius: '5px',
    color: 'rgb(255, 255, 255)',
    fontFamily: "'Montserrat', sans-serif",
  },
  primaryButtons: {
    ...DefaultStateStyle.primaryButtons,
    color: 'rgb(104, 63, 57)',
    backgroundColor: 'rgb(255, 255, 255)',
  },
  secondaryButtons: {
    ...DefaultStateStyle.secondaryButtons,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    fill: 'rgb(255, 255, 255)',
  },
  animation: {
    ...DefaultStateStyle.animation,
    type: 'animate__fadeIn',
  },
};

const GalleriaEmpire = {
  ...DefaultStateStyle,
  popup: {
    ...DefaultStateStyle.popup,
    backgroundColor: 'rgb(238, 102, 9)',
    boxShadow: '0px 0px 0px rgb(0, 0, 0)',
    borderRadius: '5px',
    borderWidth: '0px',
    borderColor: 'rgb(255, 255, 255)',
    color: 'rgb(255, 255, 255)',
    fontFamily: "'Lato', sans-serif",
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
  },
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
    fontFamily: "'Yatra One', cursive",
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
  },
};

const NarrativeCold = {
  ...DefaultStateStyle,
  popup: {
    ...DefaultStateStyle.popup,
    backgroundColor: 'rgb(104, 178, 144)',
    boxShadow: '0px 0px 0px rgb(0, 0, 0)',
    borderRadius: '5px',
    color: 'rgb(0, 0, 0)',
    fontFamily: "'Lalezar', cursive",
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
    type: 'animate__rotateIn',
  },
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
    case 'supply':
      return Supply;
    case 'simple':
      return Simple;
    case 'choco':
      return Choco;
    default:
      return DefaultStateStyle;
  }
};

export default quickThemes;

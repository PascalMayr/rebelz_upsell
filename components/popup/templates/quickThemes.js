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
};

const quickThemes = (theme) => {
  switch (theme) {
    case 'gialloBistro':
      return GialloBistro;
    default:
      return DefaultStateStyle;
  }
}

export default quickThemes;

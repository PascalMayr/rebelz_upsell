const DefaultStateStrategy = {
  mode: 'discount',
  sellType: 'cross_sell',
  maxOrderValue: '0',
  minOrderValue: '0',
  maxItemValue: '0',
  maxNumberOfItems: '3',
  storeCurrencyCode: 'USD',
  discount: {
    type: '%',
    value: '15',
  },
};

const DefaultStateStyle = {
  popup: {
    margin: '0px',
    padding: '0px',
    borderRadius: '5px',
    borderWidth: '0px 0px 0px 0px',
    borderStyle: 'solid',
    backgroundColor: 'rgb(33, 36, 37)',
    backgroundImage: 'url()',
    backgroundRepeat: 'repeat',
    backgroundOrigin: 'padding-box',
    borderColor: 'rgb(0, 128, 96)',
    boxShadow: '0px 0px 0px rgb(0, 0, 0)',
    width: '600px',
    position: 'relative',
    color: 'rgb(255, 255, 255)',
    fontFamily: "'Open Sans', sans-serif",
  },
  overlay: {
    borderRadius: '0px',
    borderWidth: '0px 0px 0px 0px',
    borderStyle: 'solid',
    backgroundColor: 'rgba(237, 237, 237, 0.20)',
    backgroundImage: 'url()',
    backgroundRepeat: 'repeat',
    backgroundOrigin: 'padding-box',
  },
  secondaryButtons: {
    width: '37px',
    height: '37px',
    borderRadius: '2px',
    borderWidth: '0px 0px 0px 0px',
    borderStyle: 'solid',
    borderColor: 'rgb(0, 128, 96)',
    backgroundColor: 'rgb(41, 47, 48)',
    backgroundImage: 'url()',
    backgroundRepeat: 'repeat',
    backgroundOrigin: 'padding-box',
    boxShadow: '0px 0px 0px rgb(0, 0, 0)',
    fill: 'rgb(255, 255, 255)',
  },
  primaryButtons: {
    margin: '0px',
    borderRadius: '2px',
    borderWidth: '0px 0px 0px 0px',
    borderStyle: 'solid',
    backgroundColor: 'rgb(128, 55, 249)',
    backgroundImage: 'url()',
    backgroundRepeat: 'repeat',
    backgroundOrigin: 'padding-box',
    borderColor: 'rgb(0, 128, 96)',
    boxShadow: '0px 0px 0px rgb(255, 255, 255)',
    position: 'relative',
    fontFamily: "'Open Sans', sans-serif",
    color: 'rgb(255, 255, 255)',
  },
  animation: {
    type: 'animate__fadeInDown',
    delay: 0,
    speed: 'normal',
  },
};

const DefaultStateNew = {
  name: '',
  styles: DefaultStateStyle,
  template: 'debut',
  published: false,
  strategy: DefaultStateStrategy,
  global: false,
  targets: {
    page: 'add_to_cart',
    entry: 'onexit',
    products: [],
    collections: [],
  },
  selling: {
    mode: 'manual',
    products: [],
    excludeProducts: [],
  },
  options: {
    multiCurrencySupport: true,
    quantityEditable: true,
    linkToProduct: false,
    enableOutOfStockProducts: false,
    interruptEvents: false,
    showImageSlider: true,
    showCountdown: true,
    countdownTime: '05:00',
  },
  texts: {
    title: 'Deal unlocked! get another for {{Discount}} off!',
    subtitle: 'Instead of <del>{{ProductPrice}}</del> pay just <strong>{{DiscountedProductPrice}}</strong>',
    addToCartAction: '🎁  &nbsp; CLAIM OFFER !',
    addToCartUnavailable: 'Unavailable',
    seeProductDetailsAction: 'See product details',
    dismissAction: 'No thanks',
    checkoutAction: 'Go to cart',
    countdown: 'Offer expires in {{Countdown}} minutes',
  },
  customCSS: '',
  customJS: '',
};

export { DefaultStateStrategy, DefaultStateStyle };
export default DefaultStateNew;

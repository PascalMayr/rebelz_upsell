const DefaultStateStrategy = {
  mode: 'discount',
  sellType: 'upsell',
  maxOrderValue: 0,
  minOrderValue: 0,
  maxItemValue: 0,
  discount: {
    type: '%',
    value: 0,
  },
};

const DefaultStateStyle = {
  popup: {
    margin: '0px',
    padding: '0px',
    borderRadius: '2px',
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
    backgroundColor: 'rgb(67, 67, 67)',
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
    backgroundColor: 'rgb(248, 152, 58)',
    backgroundImage: 'url()',
    backgroundRepeat: 'repeat',
    backgroundOrigin: 'padding-box',
    borderColor: 'rgb(0, 128, 96)',
    boxShadow: '0px 0px 0px rgb(255, 255, 255)',
    position: 'relative',
    fontFamily: "'Open Sans', sans-serif",
    color: 'rgb(255, 255, 255)',
  },
}

const DefaultStateNew = {
  name: '',
  styles: DefaultStateStyle,
  template: 'debut',
  published: false,
  strategy: DefaultStateStrategy,
  targets: {
    page: 'add_to_cart',
    products: [],
    collections: [],
  },
  selling: {
    mode: 'auto',
    products: [],
    excludeProducts: [],
  },
  animation: {
    type: 'animate__fadeInDown',
    delay: 0,
    speed: 'normal',
  },
  options: {
    multiCurrencySupport: true,
    quantityEditable: true,
    linkToProduct: true,
    hideOutOfStockProducts: true,
  },
  texts: {
    title: 'GET {{Discount}} DISCOUNT!',
    subtitle:
      'Get this product with a {{Discount}} Discount for just {{DiscountedPrice}}.',
    addToCartAction: 'Claim offer!',
    addToCartUnavailableVariation: 'Unavailable Variation',
    seeProductDetailsAction: 'See product details',
    dismissAction: 'No thanks',
    checkoutAction: 'Go to cart',
  },
  customCSS: '',
  customJS: '',
};

export { DefaultStateStrategy };
export default DefaultStateNew;

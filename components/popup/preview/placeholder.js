const PlaceholderPreview = (strategy) => {
  return {
    legacyResourceId: '6169782747321',
    title: 'The Mini Handbag by rothys',
    descriptionHtml:
      'A small structured staple. Crafted with ocean-bound marine plastic, this bag features a top handle and removable strap—so you can create the style you need for any occasion.',
    featuredImage: {
      transformedSrc:
      'https://cdn.shopify.com/s/files/1/0877/4986/products/032_Candy_Apple_pdp_A.jpg?v=1588623182&width=500',
      altText: null,
    },
    options:[
      {
        name: 'Color',
        values: ['Red', 'Blue'],
      },
    ],
    hasOnlyDefaultVariant: false,
    totalVariants: 2,
    status: 'ACTIVE',
    handle: 'young-frog',
    strategy,
    variants: {
      edges: [
        {
          node: {
            selectedOptions: [{ name: 'Color', value: 'Red' }],
            title: 'Red',
            legacyResourceId: '38752185811129',
            availableForSale: true,
            price: '200.00',
            image: {
              transformedSrc:
                'https://cdn.shopify.com/s/files/1/0877/4986/products/032_Candy_Apple_pdp_A.jpg?v=1588623182&width=500',
              altText: null,
            },
          },
        },
        {
          node: {
            selectedOptions: [{ name: 'Color', value: 'Blue' }],
            title: 'Blue',
            legacyResourceId: '38752185811121',
            availableForSale: false,
            price: '205.00',
            image: {
              transformedSrc:
                'https://cdn.shopify.com/s/files/1/0877/4986/products/032_Royal_Blue_pdp_A.jpg?v=1588713960&width=500',
              altText: null,
            },
          },
        },
      ],
    },
  };
};

export default PlaceholderPreview;

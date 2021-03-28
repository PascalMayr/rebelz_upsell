import React from 'react';

import TemplateDebut from './debut/markup';

const TemplateLoader = ({ template, ...props }) => {
  switch (template) {
    default:
      return <TemplateDebut {...props} />;
  }
};

export default TemplateLoader;

import { kebabCasify } from 'casify';

const convertStyleObjectToStyleStringPopup = (styleObject) => {
  const kebabCaseStyles = kebabCasify(styleObject);
  return Object.keys(kebabCaseStyles)
    .map((styleKey) => `${styleKey}: ${kebabCaseStyles[styleKey]}`)
    .join(';');
};

export default convertStyleObjectToStyleStringPopup;

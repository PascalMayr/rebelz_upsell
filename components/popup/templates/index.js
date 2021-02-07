import TemplateDebut from './debut/template';

const TemplateLoader = ({ template, ...props }) => {
  switch (template) {
    default:
      return <TemplateDebut {...props} />;
  }
};

export default TemplateLoader;

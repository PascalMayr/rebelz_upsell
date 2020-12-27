import ErrorMessage from './error_message';

const ErrorCommonFallBack = (error) => {
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <ErrorMessage whileMessage="while working with our Shopify App" />
    </>
  );
};

export default ErrorCommonFallBack;

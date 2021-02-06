const WebComponentProductDescriptionPopup = ({ slot, children }) => (
  <>
    {children !== '' && (
      <div
        slot={slot}
        id="salestorm-product-description"
        dangerouslySetInnerHTML={{
          __html: children,
        }}
      />
    )}
  </>
);

export default WebComponentProductDescriptionPopup;

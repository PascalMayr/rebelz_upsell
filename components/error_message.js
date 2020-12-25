import React from 'react';

const ErrorMessage = ({ whileMessage = 'while loading', suggestions = [] }) => (
  <div className="text-center">
    <h4>
      Looks like an <b>error occured</b> {whileMessage}.
    </h4>
    {suggestions.map((suggestion) => (
      <p key={suggestion}>
        <span className="text-decoration-underline">
          <strong>{suggestion}</strong>
        </span>
      </p>
    ))}
    <br />
    <p className="text-decoration-underline">
      <strong>Reach out to our Support in the right corner below.</strong>
    </p>
    <br />
    <p>
      <b>We are sorry for this and we will try to help you ASAP.</b>
    </p>
    <br />
    <p>
      <b>
        If your issue remains unresolved or if you are unable to chat with our
        Support please reach out to:
      </b>
    </p>
    <p>
      <a href="mailto:support@salestorm.cc">
        <b>support@salestorm.cc</b>
      </a>
    </p>
    <br />
    <p>
      <b>
        <span className="text-decoration-underline">
          Every customer has the right of a functioning product
        </span>{' '}
        and we will refund you immediately if you wish so.
      </b>
    </p>
    <p>
      <b>
        <a href="mailto:refund@salestorm.cc">
          <b>refund@salestorm.cc</b>
        </a>
      </b>
    </p>
  </div>
);

export default ErrorMessage;

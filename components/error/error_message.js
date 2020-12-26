import React from 'react';

const ErrorMessage = ({ whileMessage = 'while loading', suggestions = [] }) => (
  <div className="text-center">
    <h2>
      It looks like an <b>error occurred</b> {whileMessage}.
    </h2>
    {suggestions.map((suggestion) => (
      <p key={suggestion}>
        <span className="text-decoration-underline">
          <strong>{suggestion}</strong>
        </span>
      </p>
    ))}
    <br />
    <p className="text-decoration-underline">
      <strong>
        Please reach out to our Support in the right corner below.
      </strong>
    </p>
    <br />
    <p>
      <b>We are sorry about this, and we will try to help you ASAP.</b>
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
  </div>
);

export default ErrorMessage;

import React from 'react';

const ErrorMessage = ({whileMessage = 'while loading', suggestions = []}) => (
  <>
    <h4 className='text-center'>Looks like an <b>error occured</b> {whileMessage}.</h4>
    {
      suggestions.map((suggestion, index) => (
        <p className='text-center' key={`suggestion-${index}`}><span className='text-decoration-underline'><strong>{suggestion}</strong></span></p>
      ))
    }
    <br />
    <p className='text-center text-decoration-underline'><strong>Reach out to our Support in the right corner below.</strong></p>
    <br />
    <p className='text-center'><b>We are sorry for this and we will try to help you ASAP.</b></p>
    <br />
    <p className='text-center'><b>If your issue remains unresolved or if you are unable to chat with our Support please reach out to:</b></p>
    <p className='text-center'><a href="mailto:support@salestorm.cc"><b>support@salestorm.cc</b></a></p>
    <br />
    <p className='text-center'><b><span className='text-decoration-underline'>Every customer has the right of a functioning product</span> and we will refund you immediately if you wish so.</b></p>
    <p className='text-center'><b><a href="mailto:refund@salestorm.cc"><b>refund@salestorm.cc</b></a></b></p>
  </>
)

export default ErrorMessage
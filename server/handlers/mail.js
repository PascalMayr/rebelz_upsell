import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const mailTemplates = {
  planUsed100: 'd-8764f0421f7b4c438c9c75b4155254bd',
  planUsed80: 'd-75d2b67a7c3b4098804493f58d173b37',
  subscriptionChanged: 'd-27cb3447b64a41f49b04a11ad7ec9aee',
  subscriptionCanceled: 'd-4d4d9633906e4ad684ade26f1d2d0d35',
  subscriptionCreated: 'd-5915785ede254b129a476ba682b4fb4e',
  firstSale: 'd-9c5ad0df007a4b3db263389648363e28',
  customersDataRequest: 'd-0db3a042eb6549f59652ee3d616ff784',
};

const sendMail = async ({ to, template, templateData }) => {
  const message = {
    from: 'support@rebelzcommerce.com',
    to,
    templateId: template,
    dynamicTemplateData: templateData,
  };
  await sgMail.send(message);
};

export default sendMail;

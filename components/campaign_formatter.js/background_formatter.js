import { TextField } from '@shopify/polaris';

const BackgroundFormatter = ({ styles, setStyleProperty }) => {
  return (
    <>
      <TextField
        label="Background Image URL"
        value={styles.backgroundImage.match(/\((.*?)\)/)[1]}
        onChange={(value) => {
          let backgroundImage = styles.backgroundImage;
          const backgroundImageUrl = backgroundImage.match(/\((.*?)\)/)[1];
          backgroundImage =
            backgroundImageUrl === ''
              ? backgroundImage.replace(backgroundImage, `url(${value})`)
              : backgroundImage.replace(backgroundImageUrl, value);
          setStyleProperty(backgroundImage, 'backgroundImage');
        }}
      />
      <br />
      <h4>
        <strong>ⓘ&nbsp;</strong>Please use the free and reliable service of
        <strong>
          <a
            href="https://postimages.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="postimages-link text-decoration-underline"
          >
            &nbsp;Postimages&nbsp;
          </a>
        </strong>
        to upload your own background image and copy the{' '}
        <strong>Direct Link</strong> into the input field above.
      </h4>
    </>
  );
};

export default BackgroundFormatter;

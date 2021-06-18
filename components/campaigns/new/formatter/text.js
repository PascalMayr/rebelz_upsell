import { Select, TextField } from '@shopify/polaris';

const TextFormatter = ({ styles, setStyleProperty }) => {
  const fonts = [
    { value: "'Arial', sans-serif", label: 'Arial' },
    { value: "'Amiko', sans-serif", label: 'Amiko' },
    { value: "'Arima Madurai', cursive", label: 'Arima Madurai' },
    { value: "'Farsan', cursive", label: 'Farsan' },
    { value: "'Lalezar', cursive", label: 'Lalezar' },
    { value: "'Mogra', cursive", label: 'Mogra' },
    { value: "'Rakkas', cursive", label: 'Rakkas' },
    { value: "'Rasa', serif", label: 'Rasa' },
    { value: "'Shrikhand', cursive", label: 'Shrikhand' },
    { value: "'Suez One', serif", label: 'Suez One' },
    { value: "'Yatra One', cursive", label: 'Yatra One' },
    { value: "'Alegreya', serif", label: 'Alegreya' },
    { value: "'Alegreya Sans', sans-serif", label: 'Alegreya Sans' },
    { value: "'Merriweather', serif", label: 'Merriweather' },
    { value: "'Merriweather Sans', sans-serif", label: 'Merriweather Sans' },
    { value: "'Nunito', sans-serif", label: 'Nunito' },
    { value: "'Nunito Sans', sans-serif", label: 'Nunito Sans' },
    { value: "'Quattrocento', serif", label: 'Quattrocento' },
    { value: "'Quattrocento Sans', sans-serif", label: 'Quattrocento Sans' },
    { value: "'Roboto', sans-serif", label: 'Roboto' },
    { value: "'Roboto Mono', monospace", label: 'Roboto Mono' },
    { value: "'Roboto Slab', serif", label: 'Roboto Slab' },
    { value: "'BioRhyme', serif", label: 'BioRhyme' },
    { value: "'Black Ops One', cursive", label: 'Black Ops One' },
    { value: "'Bungee', cursive", label: 'Bungee' },
    { value: "'Bungee Shade', cursive", label: 'Bungee Shade' },
    { value: "'Creepster', cursive", label: 'Creepster' },
    { value: "'Ewert', cursive", label: 'Ewert' },
    { value: "'Fruktur', cursive", label: 'Fruktur' },
    { value: "'Gravitas One', cursive", label: 'Gravitas One' },
    { value: "'Monoton', cursive", label: 'Monoton' },
    { value: "'Rubrik', sans-serif", label: 'Rubrik' },
    { value: "'Open Sans', sans-serif", label: 'Open Sans' },
    { value: "'Lato', sans-serif", label: 'Lato' },
    { value: "'Montserrat', sans-serif", label: 'Montserrat' },
  ].sort((a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()));

  return (
    <>
      <Select
        label="Select a Font"
        options={fonts}
        value={styles.fontFamily}
        onChange={(value) => {
          setStyleProperty(value, 'fontFamily');
        }}
      />
      <br />
      <TextField
        label="Font Family"
        value={styles.fontFamily}
        onChange={(value) => {
          setStyleProperty(value, 'fontFamily');
        }}
      />
      <br />
      <h4>
        <strong>ⓘ&nbsp;</strong>If you want a specific font please search it on
        <strong>
          <a
            href="https://fonts.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="postimages-link"
          >
            &nbsp;Google Fonts&nbsp;
          </a>
        </strong>
        and use our Custom CSS Tab to load the font via <strong>@import</strong>
        . Then you can specify the font in the input field above.
      </h4>
    </>
  );
};

export default TextFormatter;

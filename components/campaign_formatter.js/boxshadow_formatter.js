import { RangeSlider } from '@shopify/polaris';

const BoxShadowFormatter = ({ styles, setStyleProperty }) => {
  return (
    <>
      <div className="salestorm-formatter-range">
        <RangeSlider
          label="Shadow H offset"
          value={parseInt(styles.boxShadow.split(' ')[0], 10)}
          onChange={(value) => {
            const currentBoxShadow = styles.boxShadow.split(' ');
            currentBoxShadow[0] = `${value}px`;
            setStyleProperty(currentBoxShadow.join(' '), 'boxShadow');
          }}
          output
        />
      </div>
      <div className="salestorm-formatter-range">
        <RangeSlider
          label="Shadow V offset"
          value={parseInt(styles.boxShadow.split(' ')[1], 10)}
          onChange={(value) => {
            const currentBoxShadow = styles.boxShadow.split(' ');
            currentBoxShadow[1] = `${value}px`;
            setStyleProperty(currentBoxShadow.join(' '), 'boxShadow');
          }}
          output
        />
      </div>
      <div className="salestorm-formatter-range">
        <RangeSlider
          label="Shadow spread"
          value={parseInt(styles.boxShadow.split(' ')[2], 10)}
          onChange={(value) => {
            const currentBoxShadow = styles.boxShadow.split(' ');
            currentBoxShadow[2] = `${value}px`;
            setStyleProperty(currentBoxShadow.join(' '), 'boxShadow');
          }}
          output
        />
      </div>
    </>
  );
};

export default BoxShadowFormatter;

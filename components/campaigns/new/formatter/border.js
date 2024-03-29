import { Checkbox, RangeSlider } from '@shopify/polaris';

const BorderFormatter = ({ setStyleProperty, styles }) => {
  const borderWidthShorthandSidesIndex = {
    left: 3,
    right: 1,
    bottom: 2,
    top: 0,
  };

  const getSideBorderWidth = (side) =>
    styles.borderWidth
      .split(' ')
      .slice([borderWidthShorthandSidesIndex[side]])[0];

  const getCommonBorderWidth = () => {
    const commonBorderWidth = styles.borderWidth
      .split(' ')
      .find((width) => width !== '0px');
    return commonBorderWidth ? commonBorderWidth : '0px';
  };

  const _getNewSideWidth = (value) => (value ? getCommonBorderWidth() : '0px');

  const _createNewShorthandBorderWidth = (side, value) => {
    const borderWidth = styles.borderWidth.split(' ');
    borderWidth[borderWidthShorthandSidesIndex[side]] = value;
    return borderWidth.join(' ');
  };

  return (
    <>
      <div className="range">
        <RangeSlider
          label="Border Radius in px"
          value={parseInt(styles.borderRadius, 10)}
          onChange={(value) => setStyleProperty(`${value}px`, 'borderRadius')}
          output
        />
      </div>
      <div className="range">
        <RangeSlider
          label="Border width in px"
          value={parseInt(getCommonBorderWidth(), 10)}
          onChange={(value) => {
            setStyleProperty(
              `${value}px ${value}px ${value}px ${value}px`,
              'borderWidth'
            );
          }}
          output
        />
      </div>
      <div className="banner-border-sides">
        <div>
          <Checkbox
            label="Apply to the left"
            checked={getSideBorderWidth('left') !== '0px'}
            onChange={(value) => {
              setStyleProperty(
                _createNewShorthandBorderWidth('left', _getNewSideWidth(value)),
                'borderWidth'
              );
            }}
          />
          <Checkbox
            label="Apply to the right"
            checked={getSideBorderWidth('right') !== '0px'}
            onChange={(value) => {
              setStyleProperty(
                _createNewShorthandBorderWidth(
                  'right',
                  _getNewSideWidth(value)
                ),
                'borderWidth'
              );
            }}
          />
        </div>
        <div>
          <Checkbox
            label="Apply to the top"
            checked={getSideBorderWidth('top') !== '0px'}
            onChange={(value) => {
              setStyleProperty(
                _createNewShorthandBorderWidth('top', _getNewSideWidth(value)),
                'borderWidth'
              );
            }}
          />
          <Checkbox
            label="Apply to the bottom"
            checked={getSideBorderWidth('bottom') !== '0px'}
            onChange={(value) => {
              setStyleProperty(
                _createNewShorthandBorderWidth(
                  'bottom',
                  _getNewSideWidth(value)
                ),
                'borderWidth'
              );
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BorderFormatter;

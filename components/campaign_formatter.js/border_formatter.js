import { Checkbox, RangeSlider } from '@shopify/polaris';

const BorderFormatter = ({ setStyleProperty, styles }) => {
  const borderWidthShorthandSidesIndex = {
    left: 3,
    right: 1,
    bottom: 2,
    top: 0,
  };

  const _getSideBorderWidth = (side) =>
    styles.borderWidth
      .split(' ')
      .slice([borderWidthShorthandSidesIndex[side]])[0];

  const _getCommonBorderWidth = () => {
    const commonBorderWidth = styles.borderWidth
      .split(' ')
      .find((width) => width !== '0px');
    return commonBorderWidth ? commonBorderWidth : '0px';
  };

  const _getNewSideWidth = (value) => (value ? _getCommonBorderWidth() : '0px');

  const _createNewShorthandBorderWidth = (side, value) => {
    const borderWidth = styles.borderWidth.split(' ');
    borderWidth[borderWidthShorthandSidesIndex[side]] = value;
    return borderWidth.join(' ');
  };

  return (
    <>
      <div className="salestorm-formatter-range">
        <RangeSlider
          label="Border Radius in px"
          value={parseInt(styles.borderRadius, 10)}
          onChange={(value) => setStyleProperty(`${value}px`, 'borderRadius')}
          output
        />
      </div>
      <div className="salestorm-formatter-range">
        <RangeSlider
          label="Border width in px"
          value={parseInt(_getCommonBorderWidth(), 10)}
          onChange={(value) => {
            setStyleProperty(
              `${value}px ${value}px ${value}px ${value}px`,
              'borderWidth'
            );
          }}
          output
        />
      </div>
      <div className="salestormm-banner-formatter-border-sides">
        <div className="salestorm-popup-formatter-left-right-sides">
          <Checkbox
            label="Apply to the left"
            checked={_getSideBorderWidth('left') !== '0px'}
            onChange={(value) => {
              setStyleProperty(
                _createNewShorthandBorderWidth('left', _getNewSideWidth(value)),
                'borderWidth'
              );
            }}
          />
          <Checkbox
            label="Apply to the right"
            checked={_getSideBorderWidth('right') !== '0px'}
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
        <div className="salestorm-popup-formatter-top-bottom-sides">
          <Checkbox
            label="Apply to the top"
            checked={_getSideBorderWidth('top') !== '0px'}
            onChange={(value) => {
              setStyleProperty(
                _createNewShorthandBorderWidth('top', _getNewSideWidth(value)),
                'borderWidth'
              );
            }}
          />
          <Checkbox
            label="Apply to the bottom"
            checked={_getSideBorderWidth('bottom') !== '0px'}
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

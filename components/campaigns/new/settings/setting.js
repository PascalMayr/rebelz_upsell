import Image from 'next/image';
import { RadioButton } from '@shopify/polaris';

const Setting = ({ id, image, label, name, value, onChange }) => {
  const onSettingChange = () => onChange(id);
  return (
    <div
      className="setting"
      onClick={onSettingChange}
      onKeyDown={onSettingChange}
    >
      <Image {...image} />
      <RadioButton
        label={label}
        id={id}
        name={name}
        checked={id === value}
        onSettingChange={onSettingChange}
      />
    </div>
  );
};

export default Setting;

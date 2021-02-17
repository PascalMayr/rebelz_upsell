import Setting from './setting';
import '../../../../styles/components/campaigns/new/settings/index.css';

const Settings = ({ settings = [], value }) => {
  return (
    <div className="salestorm-settings">
      {settings.map((setting) => (
        <Setting key={setting.id} {...setting} value={value} />
      ))}
    </div>
  );
};

export default Settings;

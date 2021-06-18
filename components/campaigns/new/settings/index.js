import Setting from './setting';

const Settings = ({ settings = [], value }) => {
  return (
    <div className="settings">
      {settings.map((setting) => (
        <Setting key={setting.id} {...setting} value={value} />
      ))}
    </div>
  );
};

export default Settings;

import React from 'react';

type IProps = {
  className?: string;
  currentValue: boolean;
  handleToggle: () => void; // Add handleToggle prop to handle state change
};

const SettingToggle: React.FC<IProps> = ({ className = '', currentValue, handleToggle }) => {
  if (currentValue === null) return <p>loading</p>; // Return loading if value is null
  return (
    <label className={`relative inline-flex cursor-pointer items-center ${className}`}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={currentValue} // Use currentValue to determine checkbox state
        onChange={handleToggle} // Use handleToggle to handle state change
      />
      <div className="border-color peer h-6 w-11 rounded-full bg-gray-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
    </label>
  );
};

export default SettingToggle;

import { ChevronDown, type LucideIcon } from "lucide-react";

interface PrivacySettingCardProps {
  privacyInfo: {
    key: string;
    label: string;
    description: string;
    icon: LucideIcon;
    options: readonly { value: string; label: string }[];
  };
  value: string;
  onPrivacyChange: (value: string) => void;
}

const PrivacySettingCard = ({ privacyInfo, value, onPrivacyChange }: PrivacySettingCardProps) => {

  const { key, label, description, icon: Icon, options } = privacyInfo;
  const id = `privacy-${key}`;

  return (
    <div className="p-3 sm:p-4">

      {/* Header */}
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary-700">
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <label htmlFor={id} className="text-xs font-semibold text-primary-950">
            {label}
          </label>
          <p className="text-[11px] text-secondary-500">{description}</p>
        </div>
      </div>

      {/* Privacy options Select section */}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => {
            const option = options.find(({ value: optionValue }) => optionValue === e.target.value);
            if (option) {
              onPrivacyChange(option.value);
            };
          }}
          className="w-full appearance-none rounded-lg border border-secondary-200 bg-[#f8f9fa] px-3 py-2 pr-9 text-xs text-primary-800 outline-none transition-colors focus:border-secondary-400 focus:ring-2 focus:ring-secondary-100 disabled:cursor-wait disabled:opacity-60"
        >
          {
            options.map(({ value: optionValue, label: optionLabel }) => (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            ))
          }
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary-500"
        />
      </div>
    </div>
  );
};

export default PrivacySettingCard;

type Props = {
  label: string;
  current: number;
  max: number;
  color: string;
};

const HpBar = ({ label, current, max, color }: Props) => {
  const percent = (current / max) * 100;

  return (
    <div className="self-stretch h-6 inline-flex justify-start items-end gap-2.5 flex-wrap content-end">
      <div className="inline-flex flex-col justify-start items-start">
        <div className="w-[60px] sm:w-[70px] inline-flex justify-start items-center">
          <div
            className={`justify-start text-sm sm:text-base font-bold text-darkBrown font-['Baloo_2']`}
          >
            {label}
          </div>
        </div>
      </div>
      <div className="inline-flex flex-col justify-center items-end">
        <div className="w-12 sm:w-14 inline-flex justify-end items-center">
          <div className="text-right">
            <span
              className={`text-sm sm:text-base font-bold font-['Baloo_2'] ${
                color === "green" ? "text-green" : "text-orange"
              }`}
            >
              {current}
            </span>
            <span className="text-darkBrown text-sm sm:text-base font-medium font-['Baloo_2']">
              /{max}
            </span>
          </div>
        </div>
      </div>
      <div className="w-13 sm:w-73 h-6 bg-cream rounded-md relative">
        <div
          className={`h-6 rounded-md absolute left-0 top-0 ${
            color === "green" ? "bg-green" : "bg-orange"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default HpBar;

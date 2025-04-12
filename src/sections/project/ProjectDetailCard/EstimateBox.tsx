type Props = {
  estimatedTime?: number;
};

const EstimateBox = ({ estimatedTime }: Props) => (
  <div className="self-stretch px-2 bg-cream rounded-[10px] flex justify-start items-end flex-wrap content-end">
    <div className="inline-flex flex-col justify-start items-start">
      <div className="p-2 inline-flex justify-start items-center gap-2">
        <div className="flex justify-start items-center gap-3">
          <div className="highlightText">{estimatedTime ?? '-'}</div>
        </div>
        <div className="inline-flex flex-col justify-start items-start">
          <div className="self-stretch inline-flex justify-start items-center gap-2">
            <p>Estimate Time</p>
          </div>
          <p className="self-stretch -mt-2">Days</p>
        </div>
      </div>
    </div>
  </div>
);

export default EstimateBox;

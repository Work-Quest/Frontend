type Props = {
  projectData?: {
    deadline?: string;
    daysLeft?: number;
  };
};

const DeadlineBox = ({ projectData }: Props) => (
  <div className="flex-1 self-stretch flex justify-start items-end flex-wrap content-end">
    <div className="inline-flex flex-col justify-start items-start">
      <div className="self-stretch p-2 inline-flex justify-start items-center gap-2">
        <div className="highlightText justify-start">
          {projectData?.daysLeft ?? '-'}
        </div>
        <div className="inline-flex flex-col justify-start items-start">
          <div className="self-stretch inline-flex justify-start items-center">
            <p className="!font-bold justify-start">Deadline:</p>
            <div className="p-[3px] rounded-lg flex justify-center items-center gap-2.5">
            <p className="!font-bold">{projectData?.deadline ?? '--/--/----'}</p>
            </div>
          </div>
          <p className="self-stretch -mt-2 !text-sm">Days Left !</p>
        </div>
      </div>
    </div>
  </div>
);

export default DeadlineBox;

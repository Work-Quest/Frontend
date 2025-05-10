type TeamSummaryBoxProps = {
    user: {
        name: string;
        damageDeal: number;
        damageReceive: number;
        status: string;
        isMVP: boolean;
    };
};

export default function TeamSummaryBox({
    user: { name, damageDeal, damageReceive, status, isMVP },
}: TeamSummaryBoxProps) {
    return (
        <div className="w-full">
            <div className="w-full p-3 bg-lightBrown rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start gap-2 overflow-hidden">
                <div className="self-stretch px-2 py-1 bg-brown rounded-md flex justify-start items-center">
                    <div className="flex-1 justify-start">
                        <h3 className="text-xl sm:text-2xl font-normal font-['Baloo'] truncate">
                            <span className="!text-offWhite">{name} </span>
                            <span className={`!text-${isMVP ? 'red' : 'offWhite'} drop-shadow-md`}>
                                {isMVP ? 'MVP' : ''}
                            </span>
                        </h3>
                    </div>
                </div>
                <div className="self-stretch w-full flex flex-col justify-start items-start">
                    <div className="self-stretch w-full flex justify-between items-center gap-3">
                        <div className="flex flex-col justify-start items-start gap-1">
                            <div className="p-1 flex justify-start items-center gap-2.5">
                                <p className="justify-start !text-white !font-bold">Damage Deal</p>
                            </div>
                            <div className="p-1 flex justify-start items-center gap-2.5">
                                <p className="justify-start !text-white !font-bold">Damage Receive</p>
                            </div>
                            <div className="p-1 flex justify-start items-center gap-2.5">
                                <p className="justify-start !text-white !font-bold">Status</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-start items-end gap-1">
                            <div className="p-1 flex justify-end items-center gap-2.5">
                                <p className="justify-start !text-white">{damageDeal}</p>
                            </div>
                            <div className="p-1 flex justify-end items-center gap-2.5">
                                <p className="justify-start !text-white">{damageReceive}</p>
                            </div>
                            <div className="p-1 flex justify-end items-center gap-2.5">
                                <p className="justify-start !text-white">{status}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import type { UserScore } from "@/types/User"
import { ScrollArea } from "@/components/ui/scroll-area"

type LeaderboardProps = {
  user: UserScore[]
}

type RankStyle = {
  number: number
  style: string
}

function Leaderboard({ user }: LeaderboardProps) {
  const rankStyle: RankStyle[] = [
    { number: 1, style: "!text-lightOrange !text-5xl" },
    { number: 2, style: "!text-lightBrown !text-5xl" },
    { number: 3, style: "!text-[#966B6B] !text-5xl" },
  ]

  const firstPlace = user.find((u) => u.order === 1)
  const otherPlaces = user.filter((u) => u.order !== 1).sort((a, b) => a.order - b.order)

const FirstPlaceSection = () => {
    if (!firstPlace) return null

    return (
        <div className="self-stretch flex flex-col items-start gap-2">
            <div className="self-stretch p-5 bg-[#ff995a] rounded-[10px] flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-[70px] h-[70px] bg-[#ffc3ab] rounded-full outline outline-[#faf9f6] flex items-center justify-center text-3xl font-bold text-orange-800">
                        {firstPlace.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="w-[168px] flex flex-col items-start">
                        <p className="!text-offWhite underline">
                            1st Place!
                        </p>
                        <h3 className="!text-offWhite">
                            {firstPlace.name}
                        </h3>
                        <a
                            href={`/${firstPlace.username}`}
                            className="text-cream text-base font-medium -mt-2"
                        >
                            @{firstPlace.username}
                        </a>
                    </div>
                </div>
                <img src="/crown.svg" alt="crown" />
            </div>
        </div>
    )
}


const OtherPlacesSection = () => (
    <div className="w-full h-[calc(100%-140px)] rounded-lg overflow-hidden">
        <ScrollArea className="w-full h-full">
            <div className="w-full flex flex-col gap-2 pr-4">
                {otherPlaces.map((i, index) => {
                    const style = rankStyle.find((r) => r.number === i.order)?.style || "text-[22px]"
                    const bgLeft = "bg-[#d6cec4]"
                    const outlineColor = "#d6cec4"
                    const avatarBg = [
                        "#ffba68",
                        "#b5ddff",
                        "#f76652",
                        "#938b80"
                    ][index % 4]

                    return (
                        <div
                            key={index}
                            className={`self-stretch ${bgLeft} rounded-lg flex justify-end items-center`}
                        >
                            <div className="px-3.5 flex flex-col justify-center items-center gap-2.5">
                                <h3 className={`${style}`}>
                                    {i.order}
                                </h3>
                            </div>
                            <div
                                className={`flex-1 p-2.5 bg-offWhite rounded-lg border border-veryLightBrown`}
                                style={{ outlineColor }}
                            >
                                <div className="flex justify-between items-center gap-2">
                                    <div className="flex items-center gap-2 flex-1">
                                        <div
                                            className="w-12 h-12 rounded-lg"
                                            style={{ backgroundColor: avatarBg }}
                                        ></div>
                                        <div className="flex flex-col items-start">
                                            <h3 className="-mb-2">
                                                {i.name}
                                            </h3>
                                            <a
                                                href={`/${i.username}`}
                                                className="text-lightBrown text-base font-medium font-['Baloo_2']"
                                            >
                                                @{i.username}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="!text-lightBrown">
                                            {i.score}
                                        </h3>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17"
                                            height="29"
                                            viewBox="0 0 17 29"
                                            fill="none"
                                            className="w-4 h-6"
                                        >
                                          <g clip-path="url(#clip0_473_3560)">
                                          <path d="M16.6644 12.923H16.5959C16.5949 12.923 16.594 12.923 16.5928 12.923H15.2697C15.0741 12.923 14.9112 12.7807 14.8763 12.5926C14.8763 12.5893 14.8759 12.5861 14.8759 12.5828V8.95575C14.8759 8.76781 14.7257 8.61549 14.5403 8.61549H14.4703C14.4703 8.61549 14.4693 8.61549 14.4687 8.61549H11.0216C10.8253 8.61549 10.6619 8.47202 10.6278 8.28309V6.46172H10.6212V6.18876C10.6254 6.16691 10.6278 6.14448 10.6278 6.12145V4.64821C10.6278 4.46027 10.4775 4.30795 10.2922 4.30795H8.89768C8.70107 4.30795 8.53765 4.16408 8.50388 3.97496V3.97201C8.50388 3.97201 8.50388 3.97102 8.50369 3.97063C8.50369 3.96965 8.50369 3.96866 8.50369 3.96768V2.49444C8.50369 2.3065 8.35346 2.15417 8.16811 2.15417H4.59111C4.59111 2.15417 4.59052 2.15417 4.59033 2.15417H4.24893V3.90195C4.24893 3.92714 4.25126 3.95213 4.25553 3.97594C4.25553 3.97634 4.25553 3.97654 4.25592 3.97693C4.26077 4.16054 4.40886 4.30795 4.59111 4.30795H5.97261C6.19387 4.30795 6.3732 4.48979 6.3732 4.71414V10.3633C6.3732 10.5876 6.19387 10.7695 5.97261 10.7695H4.59111C4.40886 10.7695 4.26058 10.9169 4.25611 11.1005C4.25573 11.1009 4.25573 11.1011 4.25573 11.1015C4.25146 11.1253 4.24913 11.1503 4.24913 11.1754V14.6708C4.24913 14.8953 4.06979 15.0772 3.84834 15.0772H2.46722C2.28498 15.0772 2.1365 15.2244 2.13184 15.4082C2.13145 15.4086 2.13145 15.4092 2.13145 15.4096C2.12718 15.4334 2.12485 15.458 2.12485 15.4834V16.825C2.12485 17.0493 1.94552 17.2312 1.72426 17.2312H0.342368C0.160121 17.2312 0.0116452 17.3784 0.0069871 17.5622C0.00659893 17.5626 0.00659893 17.5632 0.00659893 17.5636C0.00232903 17.5874 0 17.612 0 17.6374V25.4404C0 25.4656 0.00232903 25.4902 0.00659893 25.5142C0.00659893 25.5148 0.00659893 25.5152 0.0069871 25.516C0.0116452 25.6996 0.160121 25.8466 0.342368 25.8466H1.72348C1.94474 25.8466 2.12408 26.0285 2.12408 26.2528V27.5944C2.12408 27.6196 2.12641 27.6442 2.13068 27.6682C2.13068 27.6688 2.13068 27.6692 2.13107 27.67C2.13572 27.8536 2.2842 28.0006 2.46645 28.0006H6.04345C6.2288 28.0006 6.37922 27.8485 6.37922 27.6605V26.1873C6.37922 26.1645 6.37689 26.1422 6.37262 26.1206V25.835H6.37922V24.0255C6.41047 23.8523 6.55021 23.7173 6.72469 23.6962H8.16501C8.35036 23.6962 8.50039 23.5437 8.50039 23.3557V21.8912C8.5262 21.6924 8.69428 21.5393 8.89729 21.5393H10.2204C10.4416 21.5393 10.621 21.7211 10.621 21.9455V26.1558C10.621 26.181 10.6233 26.2056 10.6276 26.2296V27.6684C10.6276 27.6684 10.6276 27.669 10.628 27.6694C10.6322 27.8532 10.7807 28.0008 10.9633 28.0008H12.4159C12.6014 28.0008 12.7516 27.8487 12.7516 27.6607V26.18C12.7856 25.9907 12.9488 25.847 13.1454 25.847H14.5403C14.7257 25.847 14.8757 25.6949 14.8757 25.507V24.0262C14.9095 23.8371 15.0727 23.6935 15.2691 23.6933H16.6642C16.8496 23.6933 16.9998 23.5409 16.9998 23.353V13.2645C16.9998 13.0765 16.8496 12.9242 16.6642 12.9242L16.6644 12.923Z" fill="#FF9A5B"/>
                                          <path d="M2.46639 2.15377H4.2483V1.88101C4.25257 1.85916 4.25489 1.83653 4.25489 1.81331V0.340266C4.25489 0.152323 4.10467 0 3.91932 0H2.46639C2.28414 0 2.13625 0.147403 2.1312 0.330819C2.12674 0.355223 2.12402 0.380413 2.12402 0.405997V1.74758C2.12402 1.77336 2.12674 1.79835 2.1312 1.82275C2.13625 2.00637 2.28414 2.15357 2.46639 2.15357V2.15377Z" fill="#FF9A5B"/>
                                          <path d="M13.0872 6.46151H14.5402C14.7255 6.46151 14.8757 6.30919 14.8757 6.12124V4.648C14.8757 4.46006 14.7255 4.30774 14.5402 4.30774H13.0872C12.905 4.30774 12.7571 4.45514 12.7521 4.63856C12.7476 4.66296 12.7449 4.68815 12.7449 4.71393V6.05551C12.7449 6.08129 12.7476 6.10648 12.7521 6.13089C12.7571 6.3145 12.905 6.46171 13.0872 6.46171V6.46151Z" fill="#FF9A5B"/>
                                          <path d="M2.46639 10.7692H3.91932C4.10467 10.7692 4.25489 10.6169 4.25489 10.429V8.95574C4.25489 8.7678 4.10467 8.61548 3.91932 8.61548H2.46639C2.28414 8.61548 2.13625 8.76288 2.1312 8.9463C2.12674 8.9707 2.12402 8.99589 2.12402 9.02148V10.3631C2.12402 10.3888 2.12674 10.4138 2.1312 10.4382C2.13625 10.6218 2.28414 10.7691 2.46639 10.7691V10.7692Z" fill="#FF9A5B"/>
                                          </g>
                                          <defs>
                                          <clipPath id="clip0_473_3560">
                                          <rect width="17" height="28" fill="white"/>
                                          </clipPath>
                                          </defs>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
    </div>
)


  return (
    <div className="flex flex-col h-full w-full">
      <FirstPlaceSection />
      <OtherPlacesSection />
    </div>
  )
}

export default Leaderboard

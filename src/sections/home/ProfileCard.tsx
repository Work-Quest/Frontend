import type { UserProfile } from "@/types/User";
type ProfileCardProps = {
    data: UserProfile;
  };

export default function ProfileCard({data}: ProfileCardProps){
    const bossNumber:number = data.bossCollection.length;
    const remainBoss:number = bossNumber - 3;
    return (
        <div className="flex flex-col w-full h-full bg-blue rounded-3xl">
            <div className="flex items-center h-[20%] w-[100%] rounded-t-3xl bg-offWhite ">
                <h2 className="!text-darkBlue !ml-7">Profile</h2>
            </div>
            <div className="flex h-[80%] gap-10 ml-[5%] items-center">
                <div className="flex relative justify-center items-center h-[80%]">
                    <img src={data.profileImg} alt="Profile" className="absolute z-10 left-1/2 top-1/2 h-[80%] -translate-x-1/2 -translate-y-1/2 object-cover rounded-full" />
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="150" 
                        height="122" 
                        viewBox="0 0 150 122" 
                        fill="none"
                        className=" inset-0 z-0">
                        <g clip-path="url(#clip0_196_168)">
                            <path d="M12.6102 113.473H136.872C137.694 113.473 138.199 114.382 137.755 115.073C136.532 116.983 135.226 118.832 133.841 120.618C133.643 120.872 133.336 121.021 133.014 121.021H16.4705C16.1485 121.021 15.8422 120.872 15.644 120.618C14.2566 118.834 12.9503 116.983 11.7274 115.073C11.2837 114.38 11.7882 113.473 12.6102 113.473Z" fill="#31A2FF"/>
                            <path d="M6.17111 100.893H143.314C144.05 100.893 144.557 101.636 144.287 102.319C143.888 103.327 143.469 104.326 143.028 105.311C142.861 105.687 142.485 105.926 142.075 105.926H7.41209C7.00218 105.926 6.62606 105.685 6.4594 105.311C6.01796 104.326 5.59905 103.33 5.2004 102.322C4.93014 101.638 5.43463 100.895 6.17336 100.895L6.17111 100.893Z" fill="#31A2FF"/>
                            <path d="M149.428 77.8728C149.163 84.669 147.987 91.2312 146.019 97.4424C145.881 97.8744 145.478 98.1668 145.023 98.1668H4.45941C4.00671 98.1668 3.60131 97.8744 3.46392 97.4424C1.21395 90.3313 0 82.759 0 74.9055C0 34.2162 32.5897 1.13076 73.1185 0.266898C116.055 -0.648706 151.106 35.0104 149.428 77.8728Z" fill="#31A2FF"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_196_168">
                            <rect width="149.487" height="120.772" fill="white" transform="translate(0 0.248703)"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <div className="flex flex-col">
                    <h2 className="!text-white">{data.name}</h2>
                    {/* tag bagde */}
                    <div className="flex gap-2">
                        {data.tag.map((i)=>(
                            <div className="superHighlight">
                                <a className="cursor-pointer">{i.tagName}</a>
                            </div>
                        ))}
                    </div>
                    {/* Boss collection */}
                    <div className="flex mt-3 gap-2">
                        {data.bossCollection.map((i)=>(
                            <a className="cursor-pointer">
                                <img src={i.img} alt="boss" className="cursor-pointer"/>
                            </a>
                        ))}
                        {remainBoss > 0 ? ( 
                            <div className="bg-[#31A2FF] flex rounded-full justify-center items-center"> 
                                <h2 className="px-3 !text-offWhite">{remainBoss}+</h2>
                            </div>
                            ) : null}
                    </div> 
                       
                </div>
            </div>
        </div>
    )
}
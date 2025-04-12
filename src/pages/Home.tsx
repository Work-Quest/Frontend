import Leaderboard from "@/components/Leaderboard";
import type { UserScore } from "@/types/User";
import ProfileCard from "@/sections/home/ProfileCard";
import type { UserProfile } from "@/types/User";

function Home() {
   
    const userMockData:UserScore[] = [
        {"order": 1, "name": "Michael", "username": "michaelza550", "score": 12040},
        {"order": 2, "name": "William", "username": "williamshake", "score": 11522},
        {"order": 3, "name": "Sophia", "username": "sophispark", "score": 9245},
        {"order": 4, "name": "Oliver", "username": "oliverwave", "score": 9176},
        {"order": 5, "name": "Isabella", "username": "isabellaflare", "score": 8530},
        {"order": 6, "name": "Michael1", "username": "michaelza5501", "score": 8520},
        {"order": 7, "name": "Michael2", "username": "michaelza5502", "score": 8500},

    ]

    const mockProfile: UserProfile = {
        name: "John Doe",
        username: "littleJohn",
        profileImg: "/mockImg/profile.svg",
        tag: [
          {
            id: "tag1",
            tagName: "Zombie of the group",
            description: "Always active at midnighr are you a zombie???",
          },
          {
            id: "tag2",
            tagName: "Strategist",
            description: "Always plans the next move with precision.",
          },
        ],
        bossCollection: [
          {
            id: "boss1",
            bossName: "Flame King",
            img: "/mockImg/boss1.svg",
          },
          {
            id: "boss2",
            bossName: "Abyss Serpent",
            img: "/mockImg/boss2.svg",
          },
          {
            id: "boss3",
            bossName: "Doggy",
            img: "/mockImg/boss3.svg",
          },
        ],
      };
    
    return (
     <div className="flex bg-[#FDD4A0] justify-center items-center rounded-3xl border-4 border-brown">
       
        {/* left side */}
        <div className="flex flex-col w-[45vw] h-[80vh] rounded-3xl justify-center">
            <div className="flex flex-col border-2 border-orange w-[95%] h-[58%] bg-offWhite rounded-3xl">
                <div className="!mx-7 !my-1">
                    <h2 className="!text-red">Leader Board</h2>
                    <Leaderboard 
                        user={userMockData.slice(0, 5)}/>
                </div>
            </div>
            <div className="flex flex-col mt-3 border-orange w-[95%] h-[35%] bg-offWhite rounded-3xl">
                <ProfileCard 
                    data={mockProfile} />
            </div>
        </div>

        
        {/* right side */}
        <div className="flex flex-col w-[50vw] bg-offWhite h-[77vh] rounded-3xl justify-center items-center">
            <div className="flex bg-red w-[100%] h-[10%]  rounded-t-3xl justify-center items-center">
                <h2 className="!text-offWhite">Projects</h2>
            </div>
            <div className="flex w-[100%] h-[90%] justify-center items-center">
                <div className="flex  w-[96%] h-[95%] bg-blue rounded-md"></div>
            </div>
        </div>
      </div>

    )
  }
  
  export default Home
  
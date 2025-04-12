import Leaderboard from "@/components/Leaderboard";
import type { UserScore } from "@/types/User";

  

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
    
    return (
     <div className="">
        <div className="flex w-[45vw] h-[80vh] bg-brown rounded-md justify-center">
            <div className="w-[90%] bg-offWhite rounded-md">
                <h2 className="!ml-4 !mt-2 !text-red ">LeaderBoard</h2>
                <Leaderboard 
                    user={userMockData.slice(0, 5)}/>
            </div>
            

        </div>
      </div>
    )
  }
  
  export default Home
  
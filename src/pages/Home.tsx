import Leaderboard from "@/components/Leaderboard";
import type { UserScore } from "@/types/User";
import ridge from '../assets/ridge.svg'

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
     <div className="flex gap-7">
        <img src={ridge} alt="ridge" className="absolute top-[25%] left-[48%] transform -translate-x-1/2 -translate-y-1/2 z-50 w-[6rem] h-auto "/>
        <img src={ridge} alt="ridge" className="absolute top-[45%] left-[48%] transform -translate-x-1/2 -translate-y-1/2 z-50 w-[6rem] h-auto "/>
        <img src={ridge} alt="ridge" className="absolute top-[65%] left-[48%] transform -translate-x-1/2 -translate-y-1/2 z-50 w-[6rem] h-auto "/>
        <img src={ridge} alt="ridge" className="absolute top-[85%] left-[48%] transform -translate-x-1/2 -translate-y-1/2 z-50 w-[6rem] h-auto "/>

        {/* left side */}
        <div className="ml-7 flex w-[45vw] h-[80vh] bg-brown rounded-md justify-center">
            <div className="w-[85%] mr-7 bg-offWhite rounded-md">
                <h2 className="!ml-4 !mt-2 !text-red ">LeaderBoard</h2>
                <Leaderboard 
                    user={userMockData.slice(0, 5)}/>
                {/* dashed line */}
                <div className="mt-4 flex-grow border-dashed border-t-0 border-4 border-brown "></div>
                
            </div>
        </div>

        
        {/* right side */}
        <div className="flex flex-col w-[50vw] h-[80vh] rounded-md justify-center">
            <div className="flex bg-red w-[100%] h-[10%] rounded-t-md justify-center items-center">
                <h2 className="!text-offWhite">Projects</h2>
            </div>
            <div className="flex w-[100%] h-[90%] border-4 border-brown justify-center items-center">
                <div className="flex ml-7 w-[92%] h-[95%] bg-blue"></div>
            </div>
        </div>
      </div>

    )
  }
  
  export default Home
  
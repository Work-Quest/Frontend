"use client"

import { Button } from "@/components/ui/button"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { FaCaretDown } from 'react-icons/fa';
import { useEffect, useState } from "react"

function Landing() {
  const [animationStage, setAnimationStage] = useState(0)
  const [isScrollVisible, setIsScrollVisible] = useState(true)

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimationStage(1), 100),
      setTimeout(() => setAnimationStage(2), 600),
      setTimeout(() => setAnimationStage(3), 1000),
      setTimeout(() => setAnimationStage(4), 1400),
      setTimeout(() => setAnimationStage(5), 1800),
    ]

    const handleScroll = () => {
      const scrollThreshold = 50;
      setIsScrollVisible(window.scrollY < scrollThreshold)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div>
      <div className="flex justify-center items-center p-16" style={{ height: "calc(100vh - 140px)" }}>
        <div className="flex justify-center items-center gap-12">
          <div className="-m-15">
            <div
              className={`transition-all duration-1000 ease-out ${
                animationStage >= 1 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
              }`}
            >
              <DotLottieReact src="/fire.lottie"
              loop 
              autoplay 
              className="w-120 mb-10" />
            </div>
          </div>

          <div className="flex flex-col justify-center items-start gap-6">
            <div>
              <div
                className={`transition-all duration-800 ease-out delay-100 ${
                  animationStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <h2 className="text-left !text-red text-2xl font-bold">Turn Work into a Game</h2>
              </div>

              <div
                className={`transition-all duration-800 ease-out delay-200 ${
                  animationStage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <h3 className="text-left !text-brown text-xl">Unlock Achievements, Conquer Your Work!</h3>
              </div>
            </div>

            <div
              className={`w-full transition-all duration-800 ease-out delay-300 ${
                animationStage >= 4 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
              }`}
            >
              <Button className="w-full !font-bold">Start Your Quest</Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex justify-center items-center animate-bounce transition-opacity duration-700 ease-out ${
          animationStage >= 5 && isScrollVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <FaCaretDown size={20} className="text-brown mr-4" />
        <p>Scroll Down For More!</p>
      </div>
      <div className="flex justify-center items-center mt-24">
        <div className="self-stretch inline-flex flex-col justify-center items-start">
          <div className="self-stretch flex flex-col justify-start items-start">
            <h2 className="text-center justify-start !text-red">Crush Your Tasks!</h2>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start w-120">
            <div className="self-stretch text-start justify-start">
              <span className="text-brown text-base font-medium font-['Baloo_2'] mr-2">
                Take on powerful bosses by completing your tasks. Every task you finish brings you closer to victory and unlocks new challenges.
              </span>
              <span className="text-orange text-base font-bold font-['Baloo_2']">
                Ready to be the ultimate champion?
              </span>
            </div>
          </div>
        </div>
        <DotLottieReact
          src="pencil.json"
          loop
          autoplay
          className="w-130 -ml-30"
        />
      </div>
      <div className="flex justify-center items-center mt-24">
        <DotLottieReact
          src="work.lottie"
          loop
          autoplay
          className="w-150 -mr-20"
        />
        <div className="self-stretch inline-flex flex-col justify-center items-center">
          <div className="self-stretch flex flex-col justify-end items-end">
            <h2 className="text-right !text-red">Team Up, Power Up!</h2>
          </div>
          <div className="self-stretch flex flex-col justify-end items-end w-120">
            <div className="self-stretch text-right justify-end">
              <p>
                Make teamwork fun and productive by collaborating smoothly and reaching goals together. Boost motivation, share ideas, and celebrate every win as a team!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mt-36">
        <div className="self-stretch inline-flex flex-col justify-center items-start">
          <div className="self-stretch flex flex-col justify-start items-start">
            <h2 className="text-center justify-start !text-red">Compete, Conquer, Climb!</h2>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start w-120">
            <div className="self-stretch text-start justify-start">
              <p>
                Challenge your friends to exciting battles and climb the leaderboards. Show off your skills, earn rewards, and become the top player in your circle!
              </p>
            </div>
          </div>
        </div>
        <DotLottieReact
          src="medal.lottie"
          loop
          autoplay
          className="w-150 -ml-30"
        />
      </div>
      <div className="flex justify-center items-center my-24">
        <DotLottieReact
          src="AI.lottie"
          loop
          autoplay
          className="w-150 -mr-20"
        />
        <div className="self-stretch inline-flex flex-col justify-center items-center">
          <div className="self-stretch flex flex-col justify-end items-end">
            <h2 className="text-right !text-red">Smart Feedback, Powered by AI</h2>
          </div>
          <div className="self-stretch flex flex-col justify-end items-end w-120">
            <div className="self-stretch text-right justify-end">
              <p>
                Get fast, helpful feedback on your work with the power of AI. Improve quicker, fix mistakes smarter, and grow your skills with every task you complete!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing

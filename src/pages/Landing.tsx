"use client"

import { Button } from "@/components/ui/button"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { FaCaretDown } from "react-icons/fa"
import { useEffect, useState, useCallback, useRef } from "react"

function Landing() {
  const [animationStage, setAnimationStage] = useState(0)
  const [isScrollVisible, setIsScrollVisible] = useState(true)
  const [currentFlow, setCurrentFlow] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isFlowSectionInView, setIsFlowSectionInView] = useState(false)
  const flowSectionRef = useRef<HTMLDivElement>(null)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimationStage(1), 100),
      setTimeout(() => setAnimationStage(2), 600),
      setTimeout(() => setAnimationStage(3), 1000),
      setTimeout(() => setAnimationStage(4), 1400),
      setTimeout(() => setAnimationStage(5), 1800),
    ]

    const handleScroll = () => {
      const scrollThreshold = 50
      setIsScrollVisible(window.scrollY < scrollThreshold)

      if (flowSectionRef.current) {
        const rect = flowSectionRef.current.getBoundingClientRect()
        const isInView = rect.top <= window.innerHeight * 0.7 && rect.bottom >= 0

        if (isInView && !isFlowSectionInView && !currentFlow) {
          setIsFlowSectionInView(true)
          setIsTransitioning(true)
          setCurrentFlow("flow1")
        }
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isFlowSectionInView, currentFlow])

  const dotLottieRefCallback = useCallback(
    (dotLottie: any) => {
      if (dotLottie && currentFlow === "flow1") {
        const handleComplete = () => {
          setCurrentFlow("flow2")
          setShowButton(true)
        }
        dotLottie.addEventListener("complete", handleComplete)
        setTimeout(() => {
          setCurrentFlow("flow2")
          setShowButton(true)
        }, 3000)

        return () => {
          dotLottie.removeEventListener("complete", handleComplete)
        }
      }
    },
    [currentFlow],
  )

  useEffect(() => {
    if (currentFlow === "flow1" && isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [currentFlow, isTransitioning])

  return (
    <div>
      <style>
        {`
        @keyframes jumpFromBelow {
          0% {
            transform: translateY(100vh) scale(0.8);
            filter: blur(8px);
            opacity: 0;
          }
          30% {
            transform: translateY(-20px) scale(1.1);
            filter: blur(4px);
            opacity: 0.7;
          }
          60% {
            transform: translateY(10px) scale(0.95);
            filter: blur(2px);
            opacity: 0.9;
          }
          100% {
            transform: translateY(0) scale(1);
            filter: blur(0px);
            opacity: 1;
          }
        }
        
        .jump-animation {
          animation: jumpFromBelow 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .flow-container {
          transition: opacity 0.3s ease-out;
        }
      `}
      </style>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row justify-center items-center p-4 lg:p-16 min-h-[calc(100vh-140px)]">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-12 w-full max-w-6xl">
          <div className="order-2 lg:order-1 flex justify-center">
            <div
              className={`transition-all duration-1000 ease-out ${
                animationStage >= 1 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
              }`}
            >
              <DotLottieReact
                src="/fire.lottie"
                loop
                autoplay
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-80 lg:h-80 xl:w-96 xl:h-96 mb-4 lg:mb-10"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col justify-center items-center lg:items-start gap-4 lg:gap-6 text-center lg:text-left">
            <div>
              <div
                className={`transition-all duration-800 ease-out delay-100 ${
                  animationStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold">
                  Turn Work into a Game
                </h2>
              </div>

              <div
                className={`transition-all duration-800 ease-out delay-200 ${
                  animationStage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <h3 className="!text-brown text-lg sm:text-xl lg:text-2xl mt-2">
                  Unlock Achievements, Conquer Your Work!
                </h3>
              </div>
            </div>

            <div
              className={`w-full max-w-sm transition-all duration-800 ease-out delay-300 ${
                animationStage >= 4 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
              }`}
            >
              <Button className="w-full !font-bold text-sm sm:text-base">Start Your Quest</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`flex justify-center items-center animate-bounce transition-opacity duration-700 ease-out pb-4 ${
          animationStage >= 5 && isScrollVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <FaCaretDown size={20} className="text-brown mr-2 sm:mr-4" />
        <p className="text-sm sm:text-base">Scroll Down For More!</p>
      </div>

      {/* Content Sections */}
      <div className="space-y-12 sm:space-y-16 lg:space-y-24 px-4 sm:px-8 lg:px-16">
        {/* Crush Your Tasks Section */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left max-w-md lg:max-w-lg">
            <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Crush Your Tasks!</h2>
            <div className="text-sm sm:text-base">
              <span className="text-brown font-medium font-['Baloo_2'] mr-2">
                Take on powerful bosses by completing your tasks. Every task you finish brings you closer to victory and
                unlocks new challenges.
              </span>
              <span className="text-orange font-bold font-['Baloo_2']">Ready to be the ultimate champion?</span>
            </div>
          </div>
          <DotLottieReact
            src="pencil.json"
            loop
            autoplay
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80"
          />
        </div>

        {/* Team Up Section */}
        <div className="flex flex-col lg:flex-row-reverse justify-center items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col justify-center items-center lg:items-end text-center lg:text-right max-w-md lg:max-w-lg">
            <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Team Up, Power Up!</h2>
            <p className="text-sm sm:text-base">
              Make teamwork fun and productive by collaborating smoothly and reaching goals together. Boost motivation,
              share ideas, and celebrate every win as a team!
            </p>
          </div>
          <DotLottieReact
            src="work.lottie"
            loop
            autoplay
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80"
          />
        </div>

        {/* Compete Section */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left max-w-md lg:max-w-lg">
            <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Compete, Conquer, Climb!</h2>
            <p className="text-sm sm:text-base">
              Challenge your friends to exciting battles and climb the leaderboards. Show off your skills, earn rewards,
              and become the top player in your circle!
            </p>
          </div>
          <DotLottieReact
            src="medal.lottie"
            loop
            autoplay
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80"
          />
        </div>

        {/* AI Feedback Section */}
        <div className="flex flex-col lg:flex-row-reverse justify-center items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col justify-center items-center lg:items-end text-center lg:text-right max-w-md lg:max-w-lg">
            <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Smart Feedback, Powered by AI</h2>
            <p className="text-sm sm:text-base">
              Get fast, helpful feedback on your work with the power of AI. Improve quicker, fix mistakes smarter, and
              grow your skills with every task you complete!
            </p>
          </div>
          <DotLottieReact
            src="AI.lottie"
            loop
            autoplay
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80"
          />
        </div>
      </div>

      {/* Final Flow Section */}
      <div
        ref={flowSectionRef}
        className="flex justify-center items-center w-full relative mt-12 sm:mt-16 lg:mt-24"
        style={{ height: "calc(100vh - 140px)" }}
      >
        {currentFlow && (
          <div
            className={`flow-container ${currentFlow === "flow1" && isTransitioning ? "jump-animation" : ""} absolute z-10 flex justify-center items-center`}
          >
            <DotLottieReact
              src={currentFlow === "flow1" ? "flow1.lottie" : "flow2.lottie"}
              autoplay
              loop={currentFlow === "flow2"}
              dotLottieRefCallback={currentFlow === "flow1" ? dotLottieRefCallback : undefined}
              className="w-130 h-130 sm:w-135 sm:h-135 md:w-140 md:h-140 lg:w-145 lg:h-145 xl:w-150 xl:h-150"
            />
          </div>
        )}
        <Button
          className="absolute z-20 w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 !font-bold bottom-16 sm:bottom-20 lg:bottom-32 !text-darkBrown text-sm sm:text-base"
          style={{
            opacity: showButton ? 1 : 0,
            transition: "opacity 1s ease-out",
            pointerEvents: showButton ? "auto" : "none",
          }}
        >
          Start Your Quest
        </Button>
        <div className="w-full rounded-t-full bg-darkBrown h-1/2 absolute bottom-0 z-0"></div>
      </div>
    </div>
  )
}

export default Landing

"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { useEffect, useState } from "react"
import TutorialImagePagination from "@/components/TutorialImagePagination"

function Help(){
    const [animationStage, setAnimationStage] = useState(0)

    useEffect(() => {
        const timeouts = [
            setTimeout(() => setAnimationStage(1), 100),
            setTimeout(() => setAnimationStage(2), 600),
            setTimeout(() => setAnimationStage(3), 1000),
            setTimeout(() => setAnimationStage(4), 1400),
        ]

        return () => {
            timeouts.forEach((timeout) => clearTimeout(timeout))
        }
    }, [])

    return (
        <div className="!bg-white">
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row justify-center items-center p-4 lg:p-16 min-h-[calc(100vh-140px)]">
                <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-12 w-full max-w-6xl">
                    <div className="order-2 lg:order-1 flex justify-center">
                        <div
                            className={`transition-all duration-1000 ease-out ${
                                animationStage >= 1 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                            }`}
                        >
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
                                    Welcome to WorkQuest Tutorial
                                </h2>
                            </div>

                            <div
                                className={`transition-all duration-800 ease-out delay-200 ${
                                    animationStage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                                }`}
                            >
                                <h3 className="!text-brown text-lg sm:text-xl lg:text-2xl mt-2">
                                    Learn how to turn your work into an exciting game!
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tutorial Sections */}
            <div className="space-y-12 sm:space-y-16 lg:space-y-24 px-4 sm:px-8 lg:px-16">
                {/* Getting Started Section */}
                <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
                    <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left max-w-md lg:max-w-lg">
                        <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Getting Started</h2>
                        <div className="text-sm sm:text-base">
                            <span className="text-brown font-medium font-['Baloo_2'] mr-2">
                                Create your account and set up your profile. Choose your avatar, set your goals, and prepare to embark on your work quest journey.
                            </span>
                            <span className="text-orange font-bold font-['Baloo_2']">Your adventure begins here!</span>
                        </div>
                    </div>
                    <img
                        src="/assets/help/get start.png"
                        alt="Getting Started Tutorial"
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 object-contain"
                    />
                </div>

                {/* Creating Projects Section */}
                <TutorialImagePagination
                    reverse
                    items={[
                        {
                            title: "Creating Projects",
                            description:
                                "Start a new project or join an existing one. Your workspace becomes a quest, ready for goals, tasks, and rewards!",
                            imageSrc: "/assets/help/create project.png",
                            imageAlt: "Create Project",
                        },
                        {
                            title: "Creating Projects",
                            description:
                                "Set up your project in steps: define goals, add tasks, and prepare the quest flow. You can refine everything before you begin.",
                            imageSrc: "/assets/help/setup project.png",
                            imageAlt: "Setup Project",
                        },
                        {
                            title: "Creating Projects",
                            description:
                                "Invite team members to collaborate. Send an invitation, join together, and start tackling tasks as a team.",
                            imageSrc: "/assets/help/invitation email.png",
                            imageAlt: "Invite Team Members",
                        },
                    ]}
                />

                {/* Managing Tasks Section */}
                <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
                    <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left max-w-md lg:max-w-lg">
                        <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Managing Tasks</h2>
                        <p className="text-sm sm:text-base">
                            Break down your work into manageable tasks. Complete tasks to defeat bosses, earn experience points, and unlock achievements. Track your progress and watch your character level up!
                        </p>
                    </div>
                    <DotLottieReact
                        src="medal.lottie"
                        loop
                        autoplay
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80"
                    />
                </div>

                {/* Team Collaboration Section */}
                <div className="flex flex-col lg:flex-row-reverse justify-center items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
                    <div className="flex flex-col justify-center items-center lg:items-end text-center lg:text-right max-w-md lg:max-w-lg">
                        <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Team Collaboration</h2>
                        <p className="text-sm sm:text-base">
                            Work together with your team members on shared projects. Assign tasks, review work, and celebrate team achievements. Collaboration makes the quest more fun and productive!
                        </p>
                    </div>
                    <DotLottieReact
                        src="work.lottie"
                        loop
                        autoplay
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80"
                    />
                </div>

                {/* Achievements & Leaderboard Section */}
                <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
                    <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left max-w-md lg:max-w-lg">
                        <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Achievements & Leaderboard</h2>
                        <p className="text-sm sm:text-base">
                            Unlock badges and achievements as you complete tasks and reach milestones. Compete with friends on the leaderboard and see who can climb to the top. Show off your progress and celebrate your wins!
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
                        <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">AI-Powered Feedback</h2>
                        <p className="text-sm sm:text-base">
                            Get instant, intelligent feedback on your completed tasks. Our AI analyzes your work and provides helpful suggestions to improve your skills. Learn faster and grow with every task you complete!
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
        </div>
    )
}

export default Help
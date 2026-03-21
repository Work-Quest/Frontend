"use client"

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
                <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-12 w-full ">
                    <div className="order-2 lg:order-1 flex justify-center">
                        <div
                            className={`transition-all duration-1000 ease-out ${
                                animationStage >= 1 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                            }`}
                        >
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 flex flex-col justify-center items-center gap-4 lg:gap-6 text-center lg:text-left">
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
                                    Learn how to turn everyday work into an exciting adventure.
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tutorial Sections */}
            <div className="space-y-12 sm:space-y-16 lg:space-y-24 px-4 sm:px-8 lg:px-16">
                {/* Getting Started Section */}
                <div className="flex flex-col justify-center items-center gap-8 lg:gap-12 max-w-5xl mx-auto">
                    <div className="flex flex-col justify-center items-start text-left w-full">
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
                        className="min-h-full w-full"
                    />
                </div>

                {/* Welcome to Main Page Section */}
                <div className="flex flex-col justify-center items-center gap-8 lg:gap-12 max-w-5xl mx-auto">
                    <div className="flex flex-col justify-center items-start text-left w-full">
                        <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Welcome to the Main Page!</h2>
                        <div className="text-sm sm:text-base">
                            <span className="text-brown font-medium font-['Baloo_2'] mr-2">
                                After logging in, this is the main page where you can manage your project and begin your journey.
                            </span>
                        </div>
                    </div>
                    <img
                        src="/assets/help/main page.png"
                        alt="Getting Started Tutorial"
                        className="min-h-full w-full"
                    />
                </div>

                {/* Creating Projects Section */}
                <TutorialImagePagination
                    items={[
                        {
                            title: "Creating Projects",
                            description:
                                "Start a new project or join an existing one. Your workspace becomes a quest where goals, tasks, and rewards come together.",
                            imageSrc: "/assets/help/create project.png",
                            imageAlt: "Create Project",
                        },
                        {
                            title: "Creating Projects",
                            description:
                                "Once your project is created, set it up by inviting friends and adding tasks to spawn your first boss.",
                            imageSrc: "/assets/help/setup project.png",
                            imageAlt: "Setup Project",
                        },
                    ]}
                />

                {/* Setup Projects: Friend Invite Section */}
                <TutorialImagePagination
                    reverse
                    items={[
                        {
                            title: "Setup Projects: Friend Invite",
                            description:
                                "Select your friends and click Invite to send invitations.",
                            imageSrc: "/assets/help/invite.png",
                            imageAlt: "Invite",
                        },
                        {
                            title: "Setup Projects: Friend Invite",
                            description:
                                "This is what the invitation email looks like. Once they click the link, they become your party members.",
                            imageSrc: "/assets/help/invitation email.png",
                            imageAlt: "Invitation Email",
                        },
                    ]}
                />

                {/* Setup Projects: Add Initial Task */}
                <TutorialImagePagination
                    items={[
                        {
                            title: "Setup Projects: Add Initial Task",
                            description:
                                "The boss is generated from your tasks, so start by adding your initial tasks. " +
                                "You can still add more later, but adding as many as possible now gives you a clearer start. " +
                                "Tasks added later can create additional boss phases.",
                            imageSrc: "/assets/help/init add task .png",
                            imageAlt: "Add Task",
                        },
                        {
                            title: "Setup Projects: Add Initial Task",
                            description:
                                "After adding tasks and inviting friends, this page also estimates the boss HP you will face. You are now ready to begin your real journey.",
                            imageSrc: "/assets/help/finish setup.png",
                            imageAlt: "Finish Setup",
                        },
                    ]}
                />

                {/* Boss Fight Section */}
                <div className="flex flex-col justify-center items-center gap-8 lg:gap-12 max-w-5xl mx-auto">
                    <div className="flex flex-col justify-center items-start text-left w-full">
                        <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Managing Tasks</h2>
                        <div className="text-sm sm:text-base">
                            <span className="text-brown font-medium font-['Baloo_2'] mr-2">
                                You are now on the project page. Break your work into manageable tasks, defeat bosses, earn experience points, and unlock achievements as you progress.
                            </span>
                        </div>
                    </div>
                    <img
                        src="/assets/help/project page.png"
                        alt="Getting Started Tutorial"
                        className="min-h-full w-full"
                    />
                </div>

                {/* Team Collaboration Section */}
                <TutorialImagePagination
                    reverse
                    items={[
                        {
                            title: "Team Collaboration: Review",
                            description:
                                "Review your friends' work to apply buffs, debuffs, or items based on work quality. You also earn score by supporting your team.",
                            imageSrc: "/assets/help/review.png",
                            imageAlt: "Review Task",
                        },
                        {
                            title: "Setup Projects: Item",
                            description:
                                "After receiving a review, you may get an item. Items can provide useful effects like healing or damage boosts.",
                            imageSrc: "/assets/help/Item.png",
                            imageAlt: "Item",
                        },
                        {
                            title: "Setup Projects: Effect",
                            description:
                                "Effects come from team reviews or item usage. They can be positive or negative, depending on your work quality.",
                            imageSrc: "/assets/help/effect.png",
                            imageAlt: "Effect",
                        },
                    ]}
                />


                {/* Achievements & Leaderboard Section  */}
                <div className="flex flex-col justify-center items-center gap-8 lg:gap-12 max-w-5xl mx-auto">
                    <div className="flex flex-col justify-center items-start text-left w-full">
                        <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Achievements & Leaderboard</h2>
                        <div className="text-sm sm:text-base">
                            <span className="text-brown font-medium font-['Baloo_2'] mr-2">
                            Unlock badges and achievements as you complete tasks and reach milestones. Compete with friends on the leaderboard and see who can climb to the top. Show off your progress and celebrate your wins!
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center gap-2 items-center max-w-5xl">
                        <div className="flex flex-row justify-center gap-2 items-center max-w-5xl">
                            <img
                                src="/assets/help/Leaderboard.png"
                                alt=""
                                className="min-h-full w-full"
                            />
                            <img
                                src="/assets/help/achievement.png"
                                alt="Achievement"
                                className="min-h-full w-full"
                            />
                        </div>
                </div>
            </div>

                {/* AI Feedback Section */}
                <div className="flex flex-col justify-center items-center gap-8 lg:gap-12 max-w-5xl mx-auto pb-8">
                    <div className="flex flex-col justify-center items-start text-left w-full">
                        <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">AI-Personalized Feedback</h2>
                        <div className="text-sm sm:text-base">
                            <span className="text-brown font-medium font-['Baloo_2'] mr-2">
                                When a project ends, you receive intelligent, personalized feedback on your performance. Our AI analyzes your work and offers practical suggestions to help you improve with every completed task.
                            </span>
                        </div>
                    </div>
                    <img
                        src="/assets/help/project end.JPG"
                        alt="Project End"
                        className="min-h-full w-full"
                    />
                </div>
        </div>
        </div>
    )
}

export default Help
import { Button } from "./ui/button";

interface BadgeContainerProps {
  title?: string;
  badges?: string[];
  buttonText?: string;
}

export default function BadgeContainer(BadgeContainerProps: BadgeContainerProps) {
  return (
    <>
      <div className="flex flex-col gap-4 p-4 border-2 rounded-lg border-veryLightBrown">
        <p className="!text-2xl">{BadgeContainerProps.title}</p>
        <div>
          {BadgeContainerProps.badges && BadgeContainerProps.badges.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {BadgeContainerProps.badges.map((badge, index) => (
                <div key={index} className="flex items-center justify-center">
                  <img
                    src={badge}
                    alt={`Badge ${index + 1}`}
                    className="w-full h-auto rounded-md"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="!text-gray-500">No badges available</p>
          )}
        </div>
        <Button variant="default" className="!font-bold w-full">
          {BadgeContainerProps.buttonText || "View All Badges"}
        </Button>
      </div>
    </>
  )
}
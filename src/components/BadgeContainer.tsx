import { Button } from "./ui/button";

export type BadgeItem = {
  image: string;
  name: string;
};

interface BadgeContainerProps {
  title?: string;
  badges?: BadgeItem[];
  buttonText?: string;
}

export default function BadgeContainer(BadgeContainerProps: BadgeContainerProps) {
  return (
    <>
      <div className="flex flex-col h-full gap-4 p-4 border-2 rounded-lg border-veryLightBrown">
        <p className="!text-2xl">{BadgeContainerProps.title}</p>
        <div className="flex-1 overflow-auto">
          {BadgeContainerProps.badges && BadgeContainerProps.badges.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {BadgeContainerProps.badges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center justify-center gap-1">
                  <img
                    src={badge.image}
                    alt={badge.name}
                    className="h-36 w-auto rounded-md"
                  />
                  <p className="text-sm font-medium text-center">{badge.name}</p>
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
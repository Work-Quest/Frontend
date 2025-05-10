import Header from "./Header";
import { Button } from "@/components/ui/button";

const ReviewTask = () => {
  return (
    <div className="w-full pr-3 self-stretch bg-offWhite inline-flex flex-col justify-start items-start">
      <Header
        bgColor="bg-brown"
        textColor="!text-offWhite"
        text="Review Task"
      />
      <Button variant="shadow" className="m-2">
        Review
      </Button>
    </div>
  );
};

export default ReviewTask;

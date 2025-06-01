import { Button } from "@/components/ui/button"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-[calc(100vh-140px)] px-4 text-center">
      <div className="overflow-hidden">
        <DotLottieReact
          src="notfound.lottie"
          loop
          autoplay
          className="w-[200px] md:w-[700px] -mb-20 -mt-20"
        />
      </div>
      <div className="flex flex-col items-center max-w-md">
        <h1 className="text-xl md:text-2xl font-semibold mb-2">Something Missing</h1>
        <h3 className="text-sm md:text-base !text-brown">
          The page you're looking for doesn’t exist.
        </h3>
        <Button
          className="text-brown w-full mt-5"
          onClick={() => window.location.href = "/"}
        >
          Go Home
        </Button>
      </div>
    </div>
  )
}

export default NotFound

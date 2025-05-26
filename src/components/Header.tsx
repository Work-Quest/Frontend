import { useState, useEffect } from 'react';
import logo from '../assets/header-logo.svg'
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';

export default function Header(){
    const location = useLocation();
    const navigate = useNavigate();
    const [isFullScreen, setIsFullScreen] = useState<boolean>(true)
    
    useEffect(() => {
        const handleResize = () => {
            setIsFullScreen(window.innerWidth >= 768); 
        };
        handleResize;
        // Add resize event listener
        window.addEventListener('resize', handleResize);
        // Call handler once to set initial value
        handleResize();
        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

   
    type MenuItem = {
        name: string;
        path: string;
      };
    
    const items: MenuItem[] = [
        {"name" : "Home", "path" : "/home"},
        {"name" : "Profile", "path" : "/profile"},
        {"name" : "Friend", "path" : "/friend"},
        {"name" : "Help", "path" : "/help"},
    ]

    const handleClick = (path: string) => {
        console.log(`Navigating to: ${path}`);
        navigate(path);
      };

    return (
        <div className="flex overflow-hidden bg-darkBrown w-screen h-[90px] items-center justify-between z-100">
            <img src={logo} alt="Logo" className="h-[3.6875rem] w-auto ml-[2.5rem]"/>
            {isFullScreen ? (
                <div className=''>
                {items.map((i)=>(
                    <a href={i.path} className={`text-offWhite px-[1.5rem] cursor-pointer ${location.pathname == i.path ? "underline" : ""}`}>{i.name}</a>
                ))
                }
            </div>) : (
                <div className='ml-[15vw]'>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <IoMenu />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-offWhite">
                {items.map((i)=>(
                    <DropdownMenuItem 
                        className='hover:bg-veryLightBrown'
                        key={i.path}
                        onClick={() => handleClick(i.path)}>
                        {i.name}
                    </DropdownMenuItem>
                ))
                }
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            )}
            <div className='flex items-center mr-[2.5rem]'>
                <a href="/register"className='text-offWhite px-[1.5rem] cursor-pointer'>Register</a>
                <button 
                    className="flex text-darkBrown gap-1 items-center h-[2.1675rem] hover:text-brown"
                    onClick={() => handleClick("/login")}> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                        <path d="M13.5 1.125C13.7984 1.125 14.0845 1.24353 14.2955 1.4545C14.5065 1.66548 14.625 1.95163 14.625 2.25V16.875H16.3125C16.4617 16.875 16.6048 16.9343 16.7102 17.0398C16.8157 17.1452 16.875 17.2883 16.875 17.4375C16.875 17.5867 16.8157 17.7298 16.7102 17.8352C16.6048 17.9407 16.4617 18 16.3125 18H1.6875C1.53832 18 1.39524 17.9407 1.28975 17.8352C1.18426 17.7298 1.125 17.5867 1.125 17.4375C1.125 17.2883 1.18426 17.1452 1.28975 17.0398C1.39524 16.9343 1.53832 16.875 1.6875 16.875H3.375V2.25C3.375 1.95163 3.49353 1.66548 3.7045 1.4545C3.91548 1.24353 4.20163 1.125 4.5 1.125H13.5ZM11.25 11.25C11.5484 11.25 11.8345 11.1315 12.0455 10.9205C12.2565 10.7095 12.375 10.4234 12.375 10.125C12.375 9.82663 12.2565 9.54048 12.0455 9.3295C11.8345 9.11853 11.5484 9 11.25 9C10.9516 9 10.6655 9.11853 10.4545 9.3295C10.2435 9.54048 10.125 9.82663 10.125 10.125C10.125 10.4234 10.2435 10.7095 10.4545 10.9205C10.6655 11.1315 10.9516 11.25 11.25 11.25Z" />
                    </svg>
                    Login</button>
            </div>
        </div>
    )
}
export default function Footer(){
    return (
        <div className="flex overflow-hidden bg-darkBrown w-screen h-[3rem] items-center justify-between">
            <p className="!text-offWhite px-[1.25rem] !text-xs">© 2025 WorkQuest. All rights reserved.</p>
            <div className="flex items-center gap-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                <g clip-path="url(#clip0_1_1039)">
                <path d="M9.5 0C4.25125 0 0 4.25125 0 9.5C0 13.7037 2.71937 17.2544 6.49562 18.5131C6.97062 18.5963 7.14875 18.3113 7.14875 18.0619C7.14875 17.8363 7.13688 17.0881 7.13688 16.2925C4.75 16.7319 4.1325 15.7106 3.9425 15.1762C3.83562 14.9031 3.3725 14.06 2.96875 13.8344C2.63625 13.6562 2.16125 13.2169 2.95688 13.205C3.705 13.1931 4.23938 13.8937 4.4175 14.1787C5.2725 15.6156 6.63813 15.2119 7.18438 14.9625C7.2675 14.345 7.51687 13.9294 7.79 13.6919C5.67625 13.4544 3.4675 12.635 3.4675 9.00125C3.4675 7.96812 3.83562 7.11312 4.44125 6.44812C4.34625 6.21062 4.01375 5.23688 4.53625 3.93062C4.53625 3.93062 5.33187 3.68125 7.14875 4.90438C7.90875 4.69063 8.71625 4.58375 9.52375 4.58375C10.3313 4.58375 11.1388 4.69063 11.8988 4.90438C13.7156 3.66938 14.5113 3.93062 14.5113 3.93062C15.0338 5.23688 14.7013 6.21062 14.6062 6.44812C15.2119 7.11312 15.58 7.95625 15.58 9.00125C15.58 12.6469 13.3594 13.4544 11.2456 13.6919C11.59 13.9887 11.8869 14.5588 11.8869 15.4494C11.8869 16.72 11.875 17.7412 11.875 18.0619C11.875 18.3113 12.0531 18.6081 12.5281 18.5131C14.4143 17.8769 16.0534 16.665 17.2145 15.048C18.3755 13.4311 19 11.4906 19 9.5C19 4.25125 14.7487 0 9.5 0Z" fill="#FAF9F6"/>
                </g>
                <defs>
                <clipPath id="clip0_1_1039">
                <rect width="19" height="19" fill="white"/>
                </clipPath>
                </defs>
                </svg>
                <p className="!text-offWhite !text-xs">Github</p>
            </div>
        </div>
    )
}

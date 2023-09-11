import React from 'react';
import Pepper from "../svg/pepperSVG";
import Grapes from "../svg/grapesSVG";
import Apples from "../svg/applesSVG";

const PrivacyNotice = () => {
    return (
        <div className="flex flex-grow flex-col items-center bg-bodygreen h-full">
            <div className="absolute z-0 w-full h-full">
                <div className="absolute left-[15%]">
                    <Grapes />
                </div>
                <div className="absolute bottom-[25%] left-[10%]">
                    <Pepper />
                </div>
                <div className="absolute bottom-[20%] right-[8%] md:top-[25%] md:right-[8%]">
                    <Apples />
                </div>                   
            </div>
            <div className="flex flex-grow max-h-[6rem] md:max-h-48"></div>         
            <div className="flex flex-grow flex-col items-center">
                <h1>Privacy Notice Placeholder</h1>
            </div>
        </div>
    );
};

export default PrivacyNotice;
import React, { useState, useEffect} from "react"; // state is any peice of information than can change over time in react/your app. useState is a hook that you use in react, to manupulate state
// use effect is a hook that allows you to perform side effects in your components/application.
import { BiSolidSun, BiSolidMoon} from "react-icons/bi"; // Importing icons from react-icons https://react-icons.github.io/react-icons/icons/bi/

export const DarkMode = () => {
    const [theme, setTheme] = useState( // the values for the state
        typeof window !== "undefined" && localStorage.getItem
        ("theme")
        ? localStorage.getItem("theme")
        : "light"
    );
    const element = 
    typeof document !== "undefined" ? document.documentElement : null;
    useEffect(() => {
        localStorage.setItem("theme", theme);
        if(theme === "dark") {
            element.classList.add("dark");
        } else {
            element.classList.remove("light");
            element.classList.remove("dark");
        }
    
    });
  return (
    <>
    {theme === "dark" ? (
            <BiSolidSun onClick={() => setTheme("light")}
            className="text-2xl" />
        ) : (
            <BiSolidMoon onClick={() => setTheme("dark")}
            className="text-2xl" /> 
        )}
        </>
    );
};

export default DarkMode;

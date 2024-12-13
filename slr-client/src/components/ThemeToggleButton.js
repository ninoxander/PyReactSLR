import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const ThemeToggleButton = () => {
const { darkMode, toggleTheme } = useContext(ThemeContext);

return (
<div
    onClick={toggleTheme}
    className={`relative flex items-center cursor-pointer w-14 h-8 rounded-full transition ${
    darkMode ? "bg-pink-700" : "bg-fuchsia-950"
    }`}
>
    <div
    className={`absolute w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transition-transform transform ${
        darkMode ? "translate-x-6" : "translate-x-1"
    }`}
    >
    {/* Ícono dentro del indicador */}
    <FontAwesomeIcon
        icon={darkMode ? faMoon : faSun}
        className={`text-sm transition ${
        darkMode ? "text-blue-400" : "text-yellow-400"
        }`}
    />
    </div>
</div>
);
};

export default ThemeToggleButton;

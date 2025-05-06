/* eslint-disable react/prop-types */
import { createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const api_url = "http://localhost:5000";

    const value= {
        api_url,
    }


    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    )
}

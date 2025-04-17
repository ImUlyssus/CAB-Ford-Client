import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({});
    const [triggerDownload, setTriggerDownload] = useState(false); 
    return(
        <AuthContext.Provider value={{auth, setAuth, triggerDownload, setTriggerDownload}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
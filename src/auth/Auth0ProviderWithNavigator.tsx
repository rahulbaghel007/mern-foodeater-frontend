// Importing necessary modules and types
import { AppState, Auth0Provider} from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
// import { useCreateMyUser } from "../api/MyUserApi";
// import { create } from "domain";

// Defining the type for the component's props
type Props = {
 children: React.ReactNode;
};

// Component that wraps the Auth0Provider with navigation functionality
const Auth0ProviderWithNavigate = ({ children }: Props) => {
 const navigate = useNavigate();

 // Importing environment variables for Auth0 configuration
 const domain = import.meta.env.VITE_AUTH0_DOMAIN;
 const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
 const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
 const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

 // Checking if all necessary environment variables are set
 if (!domain || !clientId || !redirectUri || !audience) {
    throw new Error("unable to initialise auth");
 }

 // Function to handle redirection after authentication
 const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || "/auth-callback");
 };

 // Rendering the Auth0Provider with the necessary configuration
 return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience, 
      }}

      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
 );
};

export default Auth0ProviderWithNavigate;
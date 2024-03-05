// Import necessary hooks and functions from external libraries
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { User } from "../types";
// Define the base URL for the API, using environment variables for flexibility
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyUserRequest = async (): Promise<User> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  };

  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery("fetchCurrentUser", getMyUserRequest);

  if (error) {
    toast.error(error.toString());
  }

  return { currentUser, isLoading };
};

// Define the shape of the request payload for creating a user
type CreateUserRequest = {
 auth0Id: string; // The user's Auth0 ID
 email: string; // The user's email address
};

// Custom hook for creating a user in the system
export const useCreateMyUser = () => {
 // Use the Auth0 hook to get the access token silently
 const { getAccessTokenSilently } = useAuth0();

 // Function to make the API request to create a user
 const createMyUserRequest = async (user: CreateUserRequest) => {
    // Get the access token silently
    const accessToken = await getAccessTokenSilently();
    // Make a POST request to the API endpoint for creating a user
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`, // Authorize the request with the access token
        "Content-Type": "application/json", // Specify the content type of the request body
      },
      body: JSON.stringify(user), // Convert the user object to a JSON string
    });

    // Throw an error if the response is not OK
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
 };

 // Use the useMutation hook from React Query to manage the mutation state
 const {
    mutateAsync: createUser, // Function to trigger the mutation
    isLoading, // State indicating if the mutation is in progress
    isError, // State indicating if the mutation resulted in an error
    isSuccess, // State indicating if the mutation was successful
 } = useMutation(createMyUserRequest);

 // Return the mutation function and state variables for use in the component
 return {
    createUser,
    isLoading,
    isError,
    isSuccess,
 };
};
type UpdateMyUserRequest = {
  name: string;
  address: string;
  city: string;
  country: string;
};

export const useUpdateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return response.json();
  };

  const {
    mutateAsync: updateUser,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useMutation(updateMyUserRequest);

  if (isSuccess) {
    toast.success("User profile updated!");
  }

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return { updateUser, isLoading };
};

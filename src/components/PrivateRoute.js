import { Navigate } from "react-router-dom";
import { useUser } from "../helpers/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function PrivateRoute({ children }) {
  const { authUser, loading } = useUser();

  if (loading) {
    // Render a spinner or loading message
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <FontAwesomeIcon className="animate-spin text-6xl" icon={faSpinner} />
      </div>
    );
  }

  // Check if authUser is not present or is an empty object
  const isAuthenticated = authUser && Object.keys(authUser).length > 0;

  if (!isAuthenticated) {
    // Redirect to the signin page if not authenticated
    return <Navigate to="/signin" replace />;
  }

  // Render the requested route if authenticated
  return children;
}

export default PrivateRoute;

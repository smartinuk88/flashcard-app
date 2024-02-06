import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useUser } from "../helpers/Context";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const { handleSignInWithGoogle } = useUser();
  const navigate = useNavigate();

  const onGoogleSignInClick = async () => {
    await handleSignInWithGoogle();
    navigate("/");
  };

  return (
    <div className="flex flex-col space-y-8 h-screen w-screen pt-28 items-center bg-white">
      <h1 className="font-bold text-5xl md:text-7xl">
        Flash<span className="text-primary-blue">Fluent</span>
      </h1>
      <button
        className="p-4 flex justify-center font-semibold items-center rounded-full bg-primary-blue text-white w-3/5 lg:w-2/5 shadow-sm hover:shadow-md transition duration-75"
        onClick={onGoogleSignInClick}
      >
        <FontAwesomeIcon icon={faGoogle} className="text-3xl mr-5" /> Sign in
        with Google
      </button>
    </div>
  );
}

export default SignIn;

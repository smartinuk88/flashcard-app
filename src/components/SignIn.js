import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleSignInWithGoogle } from "../firebase-config";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function SignIn() {
  return (
    <div className="flex flex-col space-y-8 h-screen w-screen pt-28 items-center bg-gradient-to-tl from-primary-blue to-secondary-blue">
      <img src="" alt="" />
      <h1 className="font-bold text-5xl md:text-7xl text-white">FlipFluent</h1>
      <button
        className="p-4 flex justify-center font-semibold items-center rounded-full bg-white w-3/5 lg:w-2/5 shadow-sm hover:shadow-md transition duration-75"
        onClick={handleSignInWithGoogle}
      >
        <FontAwesomeIcon icon={faGoogle} className="text-3xl mr-5" /> Sign in
        with Google
      </button>
    </div>
  );
}

export default SignIn;

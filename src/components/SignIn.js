import { handleSignInWithGoogle } from "../firebase-config";

function SignIn() {
  return (
    <div className="flex h-screen w-full max-w-6xl m-auto justify-center md:p-20 ">
      <div className="flex flex-col space-y-5 justify-center spay items-center w-full lg:w-72 bg-gradient-to-tl from-primary-blue to-secondary-blue rounded-3xl">
        <img src="" alt="" />
        <h1 className="font-bold text-3xl lg:text-5xl text-white">Flip</h1>
        <button
          className="py-4 rounded-full w-full"
          onClick={handleSignInWithGoogle}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default SignIn;

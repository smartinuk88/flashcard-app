import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-between w-full space-y-6 h-screen py-20">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold">Oops, you must be lost!</h1>
        <p className="text-lg">Page not found.</p>
      </div>
      <Link to={"/"}>
        <p className="text-3xl">
          Flash<span className="font-bold text-primary-blue">Fluent</span>
        </p>
      </Link>
    </div>
  );
}

export default NotFound;

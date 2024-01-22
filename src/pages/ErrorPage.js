import { Link, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  return (
    <div className="flex flex-col items-center justify-between w-full space-y-6 h-screen py-20">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold">Oops!</h1>
        <p className="text-lg">Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
      <Link to={"/"}>
      <p className="text-3xl">
        Flash<span className="font-bold text-primary-blue">Fluent</span>
      </p>
      </Link>
    </div>
  );
}

export default ErrorPage;

import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-6">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <p className="text-3xl">
        Flash<span className="font-bold text-primary-blue">Fluent</span>
      </p>
    </div>
  );
}

export default ErrorPage;

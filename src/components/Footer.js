import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="flex justify-between items-center w-full h-10 px-6 py-3 bg-white">
      <Link to={"/"}>
        <p className="md:text-lg">
          Flash<span className="text-one">Fluent</span>
        </p>
      </Link>
      <p className="text-xs md:text-sm">Copyright Scott Martin 2024</p>
    </footer>
  );
}

export default Footer;

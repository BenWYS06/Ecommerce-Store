import { FcGoogle } from "react-icons/fc";

const GoogleButton = () => {
  return (
    <button
      type="button"
      onClick={() =>
        (window.location.href = "http://localhost:5000/api/auth/google")
      }
      className="flex h-11 w-full items-center justify-center gap-3 border border-gray-300 bg-white text-sm font-medium transition hover:bg-gray-200 text-black"
    >
      <span className="w-6 flex justify-center">
        <FcGoogle size={20} />
      </span>
      Continue with Google
    </button>
  );
};

export default GoogleButton;

import { FaFacebook } from "react-icons/fa";

const FacebookButton = () => {
  return (
    <button
      type="button"
      onClick={() =>
        (window.location.href = "http://localhost:5000/api/auth/facebook")
      }
      className="flex h-11 w-full items-center justify-center gap-3 border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-200 translate-y-[5px]"
    >
      <span className="w-6 flex justify-center">
        <FaFacebook size={20} className="text-blue-600" />
      </span>{" "}
      <span>Continue with Facebook</span>
    </button>
  );
};

export default FacebookButton;

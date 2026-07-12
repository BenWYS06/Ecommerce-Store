import { FaGithub } from "react-icons/fa";

const GithubButton = () => {
  return (
    <button
      type="button"
      onClick={() =>
        (window.location.href = "http://localhost:5000/api/auth/github")
      }
      className="flex h-11 w-full items-center justify-center gap-3 border border-gray-300 bg-white text-sm font-medium text-black transition hover:bg-gray-200"
    >
      <span className="w-6 flex justify-center">
        <FaGithub size={20} />
      </span>
      Continue with GitHub
    </button>
  );
};

export default GithubButton;

import { useState } from "react";
import { X, User } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";

const AvatarModal = ({ open, onClose, onUpload }) => {
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUserStore();

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!avatarFile) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("avatar", avatarFile);

      await onUpload(formData);

      setAvatarFile(null);
      setPreview("");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[400px] p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-5">Update Avatar</h2>

        <div className="flex justify-center mb-5">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-32 h-32 rounded-full object-cover border"
            />
          ) : user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt="preview"
              className="w-32 h-32 rounded-full object-cover border"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border bg-gray-100 flex items-center justify-center">
              <User size={50} className="text-gray-400" />
            </div>
          )}
        </div>

        <label className="flex justify-center mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <span className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 px-6 py-3 text-sm font-medium text-gray-600 transition hover:border-black hover:text-black">
            Choose Image
          </span>
        </label>

        <div className="flex justify-end gap-3 text-black">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;

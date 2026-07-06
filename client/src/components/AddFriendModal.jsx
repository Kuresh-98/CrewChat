import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import assets from "../assets/assets";

const AddFriendModal = ({ isOpen, onClose }) => {
  const { searchUser, sendRequest, respondRequest } = useContext(AuthContext);
  const [searchUsername, setSearchUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { user, relationshipStatus, requestId }
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    const data = await searchUser(searchUsername.trim());
    setLoading(false);

    if (data.success) {
      setResult(data);
    } else {
      setError(data.message || "User not found");
    }
  };

  const handleAction = async () => {
    if (!result) return;

    const { user, relationshipStatus, requestId } = result;

    if (relationshipStatus === "none") {
      const success = await sendRequest(user._id);
      if (success) {
        setResult({
          ...result,
          relationshipStatus: "sent",
        });
      }
    } else if (relationshipStatus === "received" && requestId) {
      const success = await respondRequest(requestId, "accept");
      if (success) {
        setResult({
          ...result,
          relationshipStatus: "friends",
        });
        // Close modal after brief success window
        setTimeout(onClose, 800);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-[#282142] border border-gray-600 rounded-xl text-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Friend</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Type unique username..."
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-500 rounded-lg bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-purple-400 to-violet-600 text-white font-medium rounded-lg hover:from-purple-500 hover:to-violet-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <div className="p-3 text-sm text-red-300 bg-red-950/30 border border-red-800 rounded-lg text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="p-4 bg-white/5 border border-gray-600 rounded-lg flex flex-col items-center gap-3">
            <img
              src={result.user.profilePic || assets.avatar_icon}
              alt={result.user.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="text-center">
              <h3 className="font-bold text-lg">{result.user.fullName}</h3>
              <p className="text-sm text-violet-300">@{result.user.username}</p>
              {result.user.bio && (
                <p className="text-xs text-gray-300 mt-2 italic px-4">"{result.user.bio}"</p>
              )}
            </div>

            <button
              onClick={handleAction}
              disabled={result.relationshipStatus === "friends" || result.relationshipStatus === "sent"}
              className={`w-full py-2 px-4 rounded-lg font-medium transition cursor-pointer ${
                result.relationshipStatus === "friends"
                  ? "bg-green-600/30 text-green-300 border border-green-800 cursor-not-allowed"
                  : result.relationshipStatus === "sent"
                  ? "bg-violet-600/30 text-violet-300 border border-violet-800 cursor-not-allowed"
                  : result.relationshipStatus === "received"
                  ? "bg-amber-500 hover:bg-amber-600 text-black"
                  : "bg-gradient-to-r from-purple-400 to-violet-600 hover:from-purple-500 hover:to-violet-700 text-white"
              }`}
            >
              {result.relationshipStatus === "friends" && "Already Friends"}
              {result.relationshipStatus === "sent" && "Request Sent"}
              {result.relationshipStatus === "received" && "Accept Request"}
              {result.relationshipStatus === "none" && "Send Friend Request"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFriendModal;

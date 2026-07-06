import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import assets from "../assets/assets";

const FriendRequestsModal = ({ isOpen, onClose }) => {
  const { pendingRequests, respondRequest } = useContext(AuthContext);
  const { getUsers } = useContext(ChatContext);

  if (!isOpen) return null;

  const handleResponse = async (requestId, action) => {
    const success = await respondRequest(requestId, action);
    if (success && action === "accept") {
      // Reload sidebar users immediately to show the new friend
      await getUsers();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-[#282142] border border-gray-600 rounded-xl text-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Friend Requests
            {pendingRequests.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
          {pendingRequests.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              No pending friend requests.
            </div>
          ) : (
            pendingRequests.map((request) => (
              <div
                key={request._id}
                className="flex items-center justify-between p-3 bg-white/5 border border-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={request.senderId.profilePic || assets.avatar_icon}
                    alt={request.senderId.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-sm leading-tight">
                      {request.senderId.fullName}
                    </h4>
                    <p className="text-xs text-violet-300">
                      @{request.senderId.username}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleResponse(request._id, "accept")}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-md transition cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleResponse(request._id, "decline")}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequestsModal;

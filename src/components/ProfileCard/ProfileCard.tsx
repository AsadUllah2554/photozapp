import "./ProfileCard.css";
import { useUserContext } from "../../hooks/useUserContext";

import { Avatar, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { defaultCoverImage, defaultProfileImage } from "@/common/common";

const ProfileCard = () => {
  const { user, logout } = useUserContext();

  return (
    <div className="ProfileCard">
      <div className="hidden md:block">
        <Card
          className="mb-6 overflow-hidden"
          cover={
            <img
              src={defaultCoverImage}
              alt="Cover"
              style={{ width: "100%", height: "120px", objectFit: "cover" }} 
            />
          }
        >
          <div className="text-center relative">
            <Avatar
              size={100}
              icon={<UserOutlined />}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 border-4 border-white"
              src={defaultProfileImage}
            />
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-xl font-bold mt-4">{user.name}</h2>
            <p className="text-gray-600">{user.bio}</p>
            <div className="mt-4 flex justify-around">
              <div>
                <strong>{user.postCount > 0 ? user.postCount : 0}</strong>
                <p className="text-gray-600">Posts</p>
              </div>
              <div>
                <strong>{user.friends > 0 ? user.friends : 0}</strong>
                <p className="text-gray-600">Friends</p>
              </div>
            </div>
            <span
              onClick={() => {
                console.log("My profile");
              }}
              className="profileBtn "
            >
              My Profile
            </span>
            <button className=" r-button align-middle" onClick={logout}>
              Logout
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCard;

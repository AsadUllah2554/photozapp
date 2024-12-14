"use client";

import { useState } from "react";
import axios from "axios";
import { Avatar, Card, message, Input, Button } from "antd";
import { PictureOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { useUserContext } from "@/hooks/useUserContext";
import { defaultProfileImage } from "@/common/common";

const PostShare = () => {
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, posts, setPosts } = useUserContext();
  console.log("User in : " + JSON.stringify(user, null, 2));
  console.log("User Id : " + user.id);
  const handlePostSubmit = async (e: any) => {
    if (e) {
      e.preventDefault();
    }

    setLoading(true);
    try {
      if (!postContent.trim() || !image) {
        message.error("Please add caption and image to your post");
        setLoading(false);
        return;
      }
      const formData = new FormData();

      if (image) {
        formData.append("image", image);
      }

      formData.append("description", postContent);
      formData.append("userId", user.id);

      const response = await axios.post(`/api/post/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        message.success("Post shared successfully");
        setPostContent("");
        setImage(null);
        setPostImage(null);
        console.log("Response Data: " + JSON.stringify(response.data, null, 2));
        setPosts((prevPosts: any) => [response.data.photo, ...prevPosts]);
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error sharing post:", error);
      message.error(
        `Error sharing post: ${error.response?.data?.message || error.message}`
      );
      setError(
        `Error sharing post: ${error.response?.data?.message || error.message}`
      );
    } finally {
      // Ensure loading state is always turned off
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => setPostImage(reader.result);
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <Avatar
          icon={<UserOutlined />}
          src={user.profilePicture || defaultProfileImage}
        />
        <div className="flex-grow">
          <Input.TextArea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
          {postImage && (
            <div className="mt-4 relative">
              <img
                src={postImage}
                alt="Post preview"
                className="max-h-60 w-full object-cover rounded-lg"
              />
              <Button
                type="text"
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50"
                onClick={() => setPostImage(null)}
              >
                ✕
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end items-center">
        <label htmlFor="image-upload" className="cursor-pointer">
          <PictureOutlined className="text-2xl text-gray-600 hover:text-blue-600" />
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handlePostSubmit}
          className="ml-4"
          style={{ backgroundColor: "#1890ff" }}
          disabled={loading}
        >
          Post
        </Button>
      </div>
    </Card>

    // <div className="PostShare">
    //   <img src={user.profilePicture || defaultProfileImage} alt="profile " />
    //   <HashLoader
    //     loading={loading}
    //     color="#00aaff"
    //     size={50}
    //     cssOverride={{
    //       display: "block",
    //     }}
    //   />

    //   <div>
    //     <input
    //       type="text"
    //       placeholder="What's happening?"
    //       value={description}
    //       onChange={(e) => setDescription(e.target.value)}
    //       required
    //     />

    //     <div className="postOptions">
    //       <Upload
    //         showUploadList={false}
    //         beforeUpload={() => false}
    //         onChange={handleImageChange}
    //       >
    //         <div className="option">
    //           <UilScenery />
    //         </div>
    //       </Upload>

    //       <button className="button ps-button" onClick={handleShare}>
    //         Share
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default PostShare;

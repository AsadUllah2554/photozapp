"use client";
import React, { useState } from "react";
import axios from "axios";
import { Avatar, Button, Card, Input, message, Modal } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import { defaultProfileImage, formatTimeAgo } from "@/common/common";
import { useUserContext } from "@/hooks/useUserContext";
import { Photo } from "@/common/types";

interface PostProps {
  post: Photo;
}
const Post: React.FC<PostProps> = ({ post }) => {
  const { setPosts } = useUserContext();
  const [commentText, setCommentText] = useState("");
  const [selectedPost, setSelectedPost] = useState<Photo | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();

  const initialCommentsToShow = 2;
  const commentsToDisplay = showAllComments
    ? post.comments ?? []
    : (post.comments ?? []).slice(0, initialCommentsToShow);

  const handleOpenComments = (post: Photo) => {
    setSelectedPost(post);
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `/api/post/comment`,

        {
          photoId: post.id,
          text: commentText,
          userId: user.id,
        }
      );
      if (response.status === 201) {
        message.success("Comment added successfully");
        setPosts((prevPosts: Photo[]) =>
          prevPosts.map((post) =>
            post.id === response.data.comment.photoId
              ? {
                  ...post,
                  comments: [...(post.comments ?? []), response.data.comment],
                }
              : post
          )
        );
      }
      setLoading(false);
      setCommentText("");
      setSelectedPost(null);
    } catch (error: any) {
      setLoading(false);
      console.error("Error adding comment:", error);
      message.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card key={post.id} className="mb-4">
        <div className="flex items-center mb-4">
          <Avatar src={defaultProfileImage} className="mr-4 cursor-pointer" />
          <div>
            <h3 className="font-bold cursor-pointer">{post.user?.name}</h3>
            <p className="text-gray-500 text-sm">
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        <p className="mb-4">{post.description}</p>
        {post.url && (
          <img
            src={post.url}
            alt="Post"
            className="w-full rounded-lg mb-4 object-cover max-h-96"
          />
        )}
        <div className="flex justify-between text-gray-600">
          <div
            className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleOpenComments(post)}
          >
            <CommentOutlined />
            <span>
              {Array.isArray(post.comments) &&
                post.comments.length > 0 &&
                post.comments.length}
            </span>
          </div>
        </div>
        {/* Comments Preview */}
        {(post.comments?.length ?? 0) > 0 && (
          <div className="mt-4 border-t pt-2">
            {commentsToDisplay.map((comment, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center">
                  <Avatar
                    src={defaultProfileImage}
                    size="small"
                    className="mr-2"
                  />
                  <div>
                    <span className="font-bold mr-2">{comment.user?.name}</span>
                    <span>{comment.text}</span>
                  </div>
                </div>
              </div>
            ))}

            {post.comments && post.comments.length > initialCommentsToShow &&
              !showAllComments && (
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setShowAllComments(true)}
                >
                  Show all comments ({post.comments?.length})
                </button>
              )}
          </div>
        )}
      </Card>

      {/* Comments Modal */}
      <Modal
        title="Comments"
        open={!!selectedPost}
        onCancel={() => setSelectedPost(null)}
        footer={null}
      >
        {selectedPost && (
          <div>
            <div className="mb-4">
              <Input.TextArea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </div>
            <Button
              type="primary"
              onClick={handlePostComment}
              className="mt-2"
              disabled={loading}
            >
              Add Comment
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Post;

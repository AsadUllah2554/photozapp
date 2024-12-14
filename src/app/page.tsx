"use client";

import { useUserContext } from "@/hooks/useUserContext";
import { Button, Card, Input, message, Modal } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

import { PostSkeletonList } from "@/components/Skeleton/Skeleton";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import PostShare from "@/components/PostShare/PostShare";
import Post from "@/components/Post/Post";
import NotificationCard from "@/components/NotificationCard/NotificationCard";

export default function Home() {
  const { user, posts, setPosts } = useUserContext();
  const [loading, setLoading] = useState(false);

  console.log("Post: " + posts)
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/post/fetch`);
      console.log("Response: " + JSON.stringify(response.data, null, 2));
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      message.error("Error fetching posts: ", (error as any).message);
    }
    {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (user) {
      fetchPosts();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const [selectedPost, setSelectedPost] = useState(null);
  return (
    <>  
    <h1 className=" mt-10 mx-8  text-4xl font-bold mb-5">Photoz App</h1>
      <div className=" mx-auto pt-8 px-4 md:px-20">
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfileCard />
          {/* Center: Timeline */}
          <div>
            {/* Create Post Section */}
            <PostShare />

            {/* Posts */}
            {loading ? (
              <PostSkeletonList count={4} />
            ) : (
              posts.map((post) => (
                <Post post={post} id={post._id} key={post.id} />
              ))
            )}
          </div>

          {/* Right Side: Notifications & Trending */}
          <div className="hidden md:block">
            <NotificationCard />
            <Card title="Trending Photos">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Dota 2</span>
                  <span className="text-green-600">🔥 Hot</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Valorant</span>
                  <span className="text-green-600">🔥 Hot</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cyberpunk 2077</span>
                  <span className="text-green-600">🔥 Hot</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

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
            <Button type="primary" onClick={handleAddComment} className="mt-2">
              Add Comment
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}

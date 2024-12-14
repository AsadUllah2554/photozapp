"use client";

import { useUserContext } from "@/hooks/useUserContext";
import { Card,  message, } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { PostSkeletonList } from "@/components/Skeleton/Skeleton";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import PostShare from "@/components/PostShare/PostShare";
import NotificationCard from "@/components/NotificationCard/NotificationCard";
import { Photo } from "@/common/types";
import Post from "@/components/Post/Post";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, posts, setPosts } = useUserContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/post/fetch`);
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

  if(!user) {
    return router.push("/auth");
  }
  return (
    <>  
    <h1 className=" mt-10 mx-8  text-4xl font-bold mb-5">Photoz App</h1>
      <div className=" mx-auto pt-8 px-4 md:px-20">
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfileCard />
    
          <div>
          
            <PostShare />

            {/* Posts */}
            {loading ? (
              <PostSkeletonList count={4} />
            ) : (
              posts.map((post: Photo) => (
                <Post post={post} key={post.id} />
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

     
    </>
  );
}

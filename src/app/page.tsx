"use client";

import * as React from "react";
import { api } from "@/trpc/react";
import Card from "@/components/Card";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { useIntersection } from "@mantine/hooks";

const Home = () => {
  const { data, fetchNextPage } = api.post.getPosts.useInfiniteQuery(
    {
      limit: INFINITE_QUERY_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor, // Function to get the next page parameter
      keepPreviousData: true, // Option to keep previous data while new data is loading
    },
  );

  // Merging all pages of posts into a single array using flatMap
  const posts = data?.pages.flatMap((page) => page.posts);

  // Using useRef to create a reference pointing to the last post element in the post list
  const lastPostRef = React.useRef<HTMLDivElement>(null);

  // Using the useIntersection hook to monitor when the last post element appears in the viewport
  const { ref, entry } = useIntersection({
    root: lastPostRef.current, // The root element being monitored
    threshold: 1, // Trigger when the element is fully visible
  });

  // Using the useEffect hook to implement infinite scroll loading
  React.useEffect(() => {
    // Load the next page of posts when the last post element is fully visible in the viewport
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex h-[40vh] w-[84vw] flex-col items-center justify-center rounded-lg border-2 border-black sm:h-[50vh] md:w-[70vw] lg:h-[60vh] lg:w-[50vw] xl:w-[40vw]">
        <div className="scrollbar-thumb-rounded scrollbar-w-2 scrollbar-touch flex max-h-[calc(100vh-3.5rem)] w-full flex-col gap-4 overflow-y-auto px-16 sm:px-24 2xl:px-40">
          {posts &&
            posts.length > 0 &&
            posts?.map((post, index) => {
              if (index === posts.length - 1) {
                return (
                  <Card
                    ref={ref}
                    key={post.id}
                    img={post.img}
                    title={post.title}
                    author={post.author}
                  />
                );
              } else {
                return (
                  <Card
                    key={post.id}
                    img={post.img}
                    title={post.title}
                    author={post.author}
                  />
                );
              }
            })}
        </div>
      </div>
    </div>
  );
};

export default Home;

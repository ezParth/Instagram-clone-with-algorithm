import React from "react";
import Post from "./Post";

function Posts() {
  return (
    <div className="flex-1 my-8 flex flex-col items-center pl-[20%]">
      {
          [1, 2, 3, 4].map((item, index) => {
            return <Post key={index} />;
      })
      }
    </div>
  );
}

export default Posts;

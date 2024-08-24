import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

function CommentDialog({ open, setOpen }) {
  const [text, setText] = useState("");
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const sendMessageHandler = (e) => {
    alert(text);
  }
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src="https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">username</Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger aschild>
                  <MoreHorizontal className="cursor-pointer" />
                  <DialogContent className="flex flex-col items-center text-center">
                    <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                      Unfollow
                    </div>
                    <div>add to favorite</div>
                  </DialogContent>
                </DialogTrigger>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              Comments here
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  onChange={changeEventHandler}
                  value={text}
                  className="w-full outline-none border border-gray-300 p-2 rounded"
                />
                <Button variant="outline" disabled={!text.trim()} onClick={sendMessageHandler}>Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;

//dialog ke ander ek open function hota hai jismke andar true ya false value deni hoti hai
//onInteractOutside mtln outside pr click krne pr dialog-content badn ho jaega => to jaise hi ham outside pr interact krte hai ham ander ke function me setOpen pass krke usko false kr de rhe ahi jis wajah se open ki value bhi false ho ja rhi hai aur is wajah se Dialog-content close ho ja rha hai
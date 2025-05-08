"use client";

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Plus, Search, Settings, ThumbsUp, ThumbsDown, Share, MoreVertical, Send, X, Paperclip, Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import toast from "react-hot-toast"

export default function ChatAIPlus() {
  // File upload state
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("handleFileUpload called", e.target.files);
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMenuOpen(false);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://localhost:8000/upload_pdf", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      toast.success("PDF uploaded successfully!");
      // Optionally handle response
    } catch (err) {
      toast.error("File upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setMenuOpen(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
    toast("Image upload not implemented yet.", { icon: "🖼️" });
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-[#e6effa]">
      <div className="w-full max-w-6xl h-full bg-white rounded-3xl overflow-hidden flex shadow-lg border border-[#e3eaf3]">
        {/* Sidebar */}
        <div className="w-[340px] bg-white border-r border-[#e3eaf3] flex flex-col">
          <div className="p-6 pb-2">
            <h1 className="text-xl font-bold mb-6 tracking-tight text-[#23272f]">CHAT A.I+</h1>
            <div className="flex gap-2 mb-6">
              <Button className="flex-1 bg-[#6c63ff] hover:bg-[#554ee2] text-white rounded-full font-medium shadow-none">
                <Plus className="mr-2 h-4 w-4" /> New chat
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-[#e3eaf3] text-[#6c63ff]">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-[#8a94a6] font-medium">Your conversations</span>
              <Button variant="link" className="text-xs text-[#6c63ff] p-0 font-medium">Clear All</Button>
            </div>
          </div>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-1">
              <ConversationItem title="Create Html Game Environment..." />
              <ConversationItem title="Apply To Leave For Emergency" />
              <ConversationItem title="What Is UI UX Design?" />
              <ConversationItem title="Create POS System" />
              <ConversationItem title="What Is UX Audit?" />
              <ConversationItem title="Create Chatbot GPT..." active />
              <ConversationItem title="How Chat GPT Work?" />
            </div>
            <div className="py-3 mt-4">
              <div className="text-xs text-[#b0b8c9] mb-2">Last 7 Days</div>
              <div className="space-y-1">
                <ConversationItem title="Crypto Lending App Name" />
                <ConversationItem title="Operator Grammar Types" />
                <ConversationItem title="Min States For Binary DFA" inactive />
              </div>
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-[#e3eaf3]">
            <Button variant="ghost" className="w-full justify-start text-[#23272f] hover:bg-[#f5f7fa] font-medium">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <div className="flex items-center mt-4">
              <Avatar className="h-8 w-8 mr-2">
                <Image
                  src="https://ui-avatars.com/api/?name=Andrew+Neilson&background=6c63ff&color=fff&size=64"
                  width={32}
                  height={32}
                  alt="User avatar"
                  className="rounded-full"
                />
              </Avatar>
              <span className="text-sm font-medium text-[#23272f]">Andrew Neilson</span>
            </div>
          </div>
        </div>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-white">
          {/* Only this area should scroll! */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full p-10">
              <div className="space-y-8 max-w-3xl mx-auto">
                {/* User Message */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <Image
                      src="https://ui-avatars.com/api/?name=Andrew+Neilson&background=6c63ff&color=fff&size=64"
                      width={32}
                      height={32}
                      alt="User avatar"
                      className="rounded-full"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#23272f] font-medium">
                        Create a chatbot gpt using python language what will be step for that
                      </p>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#f5f7fa]">
                        <X className="h-4 w-4 text-[#b0b8c9]" />
                      </Button>
                    </div>
                  </div>
                </div>
                {/* AI Response */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1 bg-[#f5f7fa] text-[#6c63ff]">
                    <div className="text-xs font-semibold">AI</div>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs text-[#6c63ff] font-semibold">CHAT A.I+ <span className="ml-1">🤖</span></div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#f5f7fa]">
                        <X className="h-4 w-4 text-[#b0b8c9]" />
                      </Button>
                    </div>
                    <div className="text-sm space-y-4 text-[#23272f]">
                      <p>
                        <span className="font-semibold">Sure, I can help you get started with creating a chatbot using GPT in Python. Here are the basic steps you'll need to follow:</span>
                      </p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>
                          <span className="font-semibold">Install the required libraries:</span> You'll need to install the transformers library from Hugging Face to use GPT. You can install it using pip.
                        </li>
                        <li>
                          <span className="font-semibold">Load the pre-trained model:</span> GPT comes in several sizes and versions, so you'll need to choose the one that fits your needs. You can load a pre-trained GPT model. This loads the 1.3B parameter version of GPT-Neo, which is a powerful and relatively recent model.
                        </li>
                        <li>
                          <span className="font-semibold">Create a chatbot loop:</span> You'll need to create a loop that takes user input, generates a response using the GPT model, and outputs it to the user. Here's an example loop that uses the input() function to get user input and the gpt() function to generate a response. This loop will keep running until the user exits the program or the loop is interrupted.
                        </li>
                        <li>
                          <span className="font-semibold">Add some personality to the chatbot:</span> While GPT can generate text, it doesn't have any inherent personality or style. You can make your chatbot more interesting by adding custom prompts or responses that reflect your desired personality. You can then modify the chatbot loop to use these prompts and responses when appropriate. This will make the chatbot seem more human-like and engaging.
                        </li>
                      </ol>
                      <p>
                        <span className="font-semibold">These are just the basic steps to get started with a GPT chatbot in Python.</span> Depending on your requirements, you may need to add more features or complexity to the chatbot. Good luck!
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-[#e3eaf3] hover:bg-[#f5f7fa]">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-[#e3eaf3] hover:bg-[#f5f7fa]">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-[#e3eaf3] hover:bg-[#f5f7fa]">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-[#e3eaf3] hover:bg-[#f5f7fa]">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      <div className="ml-auto">
                        <Button variant="outline" size="sm" className="rounded-full text-xs border-[#e3eaf3] hover:bg-[#f5f7fa]">
                          <div className="flex items-center gap-1">
                            <div className="h-4 w-4 rounded-full bg-[#e6effa] flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-[#6c63ff]"></div>
                            </div>
                            Regenerate
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
          {/* Chat Input */}
          <div className="p-6 border-t border-[#e3eaf3] bg-white">
            <div className="max-w-3xl mx-auto relative flex items-center gap-2">
              {/* File upload button with dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="rounded-full bg-[#f5f7fa] hover:bg-[#e6effa] p-2 flex items-center justify-center border border-[#e3eaf3]"
                  onClick={() => setMenuOpen((v) => !v)}
                  disabled={uploading}
                  aria-label="Attachment Menu"
                >
                  {uploading ? (
                    <Loader2 className="h-5 w-5 text-[#6c63ff] animate-spin" />
                  ) : (
                    <Paperclip className="h-5 w-5 text-[#6c63ff]" />
                  )}
                </button>
                {/* Dropdown menu */}
                {menuOpen && (
                  <div className="absolute left-0 z-10 bottom-full mb-2 rounded-xl bg-white border border-[#e3eaf3] shadow-lg animate-fade-in-up">
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#23272f] hover:bg-[#f5f7fa] rounded-t-xl transition-colors"
                      onClick={() => {
                        setMenuOpen(false);
                        imageInputRef.current?.click();
                      }}
                    >
                      <span role="img" aria-label="Image">🖼️</span> Image
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#23272f] hover:bg-[#f5f7fa] rounded-b-xl transition-colors"
                      onClick={() => {
                        setMenuOpen(false);
                        fileInputRef.current?.click();
                      }}
                    >
                      <span role="img" aria-label="PDF">📄</span> PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        onChange={(e)=>handleFileUpload(e)}
                        // className="hidden"
                        // disabled={uploading}
                      />
                    </button>
                  </div>
                )}
              </div>
              {/* Chat input and send button */}
              <div className="flex-1 relative">
                <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                  <Button size="icon" variant="ghost" className="rounded-full bg-[#6c63ff] text-white h-8 w-8 hover:bg-[#554ee2]">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <Input 
                  placeholder="What's in your mind?..." 
                  className="pr-12 py-6 rounded-full border-[#e3eaf3] bg-[#f5f7fa] focus:ring-2 focus:ring-[#6c63ff] text-[#23272f] placeholder:text-[#b0b8c9] font-medium" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Animation keyframes for fade-in-up */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.18s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  )
}

function ConversationItem({
  title,
  active = false,
  inactive = false,
}: {
  title: string
  active?: boolean
  inactive?: boolean
}) {
  return (
    <button
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
        active
          ? "bg-[#e6effa] text-[#6c63ff]"
          : inactive
          ? "text-[#b0b8c9]"
          : "text-[#23272f] hover:bg-[#f5f7fa]"
      }`}
    >
      {title}
    </button>
  )
}

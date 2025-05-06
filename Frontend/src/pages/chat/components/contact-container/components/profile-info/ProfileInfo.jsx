import { IoPowerSharp } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AppContext } from "@/context/AppContext";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useContext } from "react";
import {FiEdit2} from "react-icons/fi"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
export const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const { api_url } = useContext(AppContext);

  const navigate = useNavigate();

  const logout = async() => {
    try {
      const response = await axios.post(`${api_url}/api/auth/logout`,{},{withCredentials:true})

      if(response.status === 200){
        navigate("/auth")
        setUserInfo(null)
        toast.success("logout successfully")
      }
    } catch (error) {
        console.log(error);
    } 
  };

  return (
    <div className="absolute bottom-0  h-16 items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex mt-2 gap-3 items-center justify-center relative right-10">
        <div className="w-12 h-12 relative ">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${api_url}/${userInfo.image}`}
                alt="profile"
                className="object-cover h-full w-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5 lg:left-5 relative left-0 justify-end bottom-8">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <FiEdit2 onClick={() => navigate("/profile")} className="text-purple-600 text-xl font-medium"/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <IoPowerSharp onClick={logout} className="text-red-600 text-xl font-medium"/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

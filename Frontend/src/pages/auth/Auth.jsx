import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"
import victory from "../../assets/victory.svg";
import loginImg from "../../assets/login2.png"
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";




export const Auth = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const {setUserInfo} = useAppStore()

const navigate = useNavigate();
const { api_url } = useContext(AppContext)

const validateSignup = () => {
    if(!email.length){
        toast.error("Email is required")
        return false
    }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return false;
      }
    return true
}

const validateLogin = () => {
  if(!email.length){
      toast.error("Email is required")
      return false
  }
    if (!password.length) {
      toast.error("Password must be required");
      return false;
    }
  return true
}

const handleLogin = async() => {
  if(validateLogin()){
      const response = await axios.post(`${api_url}/api/auth/login`,{email, password}, {withCredentials:true})
      if(response.data.user.id){
        setUserInfo(response.data.user)
        if(response.data.user.profileSetup) navigate("/chat")
        else navigate("/profile")
      }
    
  }
}

const handleSignup = async() => {
    if(validateSignup()){
        const response = await axios.post(`${api_url}/api/auth/signup`, {email, password},{withCredentials:true})
        if(response.status === 201){
          setUserInfo(response.data.user)
            navigate("/profile")
            toast.success("Account is created")
        }
    }

    
}

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <div className="h-[90vh] border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">welcome</h1>
              <img src={victory} alt="victory emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-600 transition-all p-3 duration-300"
                  value="login"
                >
                  login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-600 transition-all p-3 duration-300"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={handleLogin} className="rounded-full p-6">Login</Button>
              </TabsContent>

              <TabsContent className="flex flex-col gap-5" value="signup">
              <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Input placeholder="confirm password" type="password" className="rounded-full p-6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <Button onClick={handleSignup} className="rounded-full p-6">Sign up</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
            <img src={loginImg} alt="" />
        </div>
      </div>
    </div>
  );
}; 

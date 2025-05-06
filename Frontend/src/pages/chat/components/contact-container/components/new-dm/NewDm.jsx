import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "lottie-react";
import animationData from "../../../../../../assets/lottie-json.json";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";

export const NewDm = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModal, setOpenNewContactModel] = useState(false);
  const [serachedContacts, setSearchedContacts] = useState([]);
  const { api_url } = useContext(AppContext);

  const searchContacts = async (searchTerm) => {
    try {
      if (!searchTerm.trim()) {
        setSearchedContacts([]);
        return;
      }

      const response = await axios.post(
        `${api_url}/api/contacts/search`,
        { searchTerm }, // Fix spelling here
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.contacts) {
        setSearchedContacts(response.data.contacts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatData(contact);
    setSelectedChatType("contact");
    setSearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-500 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white mb-2 p-3">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              onChange={(e) => searchContacts(e.target.value)}
              placeholder="Search contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            />
          </div>

          {serachedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              {serachedContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 items-center cursor-pointer mb-2"
                  onClick={() => selectNewContact(contact)}
                >
                  <div className="w-12 h-12 relative ">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                      {contact.image ? (
                        <AvatarImage
                          src={`${api_url}/${contact.image}`}
                          alt="profile"
                          className="object-cover h-full w-full bg-black"
                        />
                      ) : (
                        <div
                          className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                            contact.color
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}

          {serachedContacts.length <= 0 && (
            <div className="flex-1 md:bg-[#181920] md:flex md:mt-0 sm:flex flex-col justify-center items-center duration-1000 transition-all">
              <Lottie
                animationData={animationData}
                loop={true}
                autoPlay={true}
                style={{ height: 100, width: 100 }}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi Search new
                  <span className="text-purple-500"> Contact</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

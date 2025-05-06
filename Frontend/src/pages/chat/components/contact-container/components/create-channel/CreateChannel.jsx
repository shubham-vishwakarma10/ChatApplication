import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { useAppStore } from "@/store";

import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiple-selector";

export const CreateChannel = () => {
  const { setSelectedChatType, setSelectedChatData, addChannel } =
    useAppStore();
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  const { api_url } = useContext(AppContext);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        `${api_url}/api/contacts/get-all-contacts`,
        { withCredentials: true }
      );
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  const CreateChannel = async () => {
    try {
      const response = await axios.post(
        `${api_url}/api/channel/create-channel`,
        {
          name: channelName,
          members: selectedContacts.map((contact) => contact.value),
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setChannelName("");
        setSelectedContacts([]);
        setNewChannelModal(false);
        addChannel(response.data.channel);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-500 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white mb-2 p-3">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel.
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Search contacts"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  No result found.
                </p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={CreateChannel}
            >
              create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

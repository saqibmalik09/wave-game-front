'use client';

import ApiService from "@/lib/api/api";
import TeenPattiGame from "./TeenPattiGame";
import { setUserPlayerInfo } from "@/lib/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { teenpattiGameTableJoin } from "@/lib/socket/game/teenpatti/teenpattiSocketEventHandler";
import { useState, useEffect } from "react";
import MessageModal from "@/app/components/messageModel";
import GameLoading from "@/app/components/GameLoading";
import initSocket from "@/lib/socket/socketClient";
interface UserData {
  id: string;
  name: string;
  balance: number;
  profilePicture: string;
}
interface GameUserInfoResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export default function TeenPattiPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState({ title: "", message: ""});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const appKey = params.get("appKey");
        const token = params.get("token");
        const gameId = params.get("gameId");

        if (!appKey || !token || !gameId) {
          setModalMessage({
            title: "Invalid Params",
            message: "appKey, token, and gameId are required",
          });
          setShowModal(true);
          setLoading(false);
          return;
        }

        const tenantDomainURL = 'http://127.0.0.1:5000';
        const response: GameUserInfoResponse = await ApiService.gameUserInfo({
          token: token,
          tenantDomainURL,
        });
        console.log("Fetched user info:", response);

        if (response.success) {
          dispatch(setUserPlayerInfo({
            success: response.success,
            message: response.message,
            data: response.data,
          }));
          let userId=response.data.id??"00000";
           initSocket({userId,appKey,token});
        
         
          setTimeout(() => {
            setLoading(false);
          }, 2000); 
          return;
        }

        setModalMessage({
          title: "Missing information",
          message: "Invalid or missing userInfo",
        });
        setShowModal(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setModalMessage({
          title: "Error",
          message: "Failed to fetch user info",
        });
        setShowModal(true);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // -------------------------
  // Loading Screen
  // -------------------------
  if (loading) {
    return (
    <div>
       <GameLoading />
    </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white space-y-6">
      <TeenPattiGame />

      {/* Modal for displaying messages */}
      <MessageModal
        show={showModal}
        header={modalMessage.title}
        message={modalMessage.message}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

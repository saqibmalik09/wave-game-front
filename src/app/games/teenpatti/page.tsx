'use client';

import ApiService from "@/lib/api/api";
import TeenPattiGame from "./TeenPattiGame";
import { setUserPlayerInfo } from "@/lib/redux/slices/userSlice";
import { setTenantDetails } from "@/lib/redux/slices/tenantDetails";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import MessageModal from "@/app/components/messageModel";
import GameLoading from "@/app/components/GameLoading";
import initSocket from "@/lib/socket/socketClient";
import type { RootState } from "@/lib/redux/store";
import { teenpattiGameTableJoin } from "@/lib/socket/game/teenpatti/teenpattiSocketEventHandler";

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

export default function TeenPattiPages() {
  const dispatch = useDispatch();

  const tenant = useSelector((state: RootState) => state.tenantDetails.data);
  const user = useSelector((state: RootState) => state.userPlayerData?.data);

  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });
  const [showModal, setShowModal] = useState(false);

  // Prevent double init (StrictMode)
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const bootstrap = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const appKey = params.get("appKey");
        const token = params.get("token");
        const gameId = params.get("gameId");

        if (!appKey || !token || !gameId) {
          throw new Error("appKey, token, and gameId are required");
        }

        // 2️⃣ Tenant (Redux first)
        let tenantConfig = tenant;
        if (!tenantConfig) {
          const tenantResponse = await ApiService.tenantConfigByAppKey(appKey);
          if (!tenantResponse?.success) {
            throw new Error("Invalid AppKey OR tenant not found");
          }

          tenantConfig = tenantResponse.data;
          dispatch(setTenantDetails(tenantConfig));
        }

        // 3️⃣ User info
        let userInfo = user;
        if (!userInfo) {
          let tenantBaseURL;
          if (tenantConfig.environemnt === "production") {
            tenantBaseURL = tenantConfig.tenantProductionDomain;
          } else {
            tenantBaseURL = tenantConfig.tenantTestingDomain;
          }
          const response: GameUserInfoResponse =
            await ApiService.gameUserInfo({
              token,
              tenantDomainURL: tenantBaseURL,
            });

          if (!response.success) {
            setModalMessage({
              title: "Initialization Error",
              message: response.message || "Something went wrong",
            });
            setShowModal(true);
            setLoading(false);
          }

          userInfo = response.data;
          dispatch(setUserPlayerInfo({
            success: true,
            message: response.message,
            data: userInfo,
          })
          );
        }

        // 4️⃣ Socket init
        initSocket({
          userId: userInfo.id,
          appKey,
          name: userInfo.name,
          profilePicture: userInfo.profilePicture,
          token
        });
        setLoading(false)
        const NewJoiner = {
          userId: userInfo.id,
          name: userInfo.name,
          imageProfile: userInfo.profilePicture,
          appKey: appKey,
          token: token
        };
        setTimeout(() => {
          teenpattiGameTableJoin(NewJoiner);
        }, 3000);
        setLoading(false);
      } catch (error: any) {
        setModalMessage({
          title: "Initialization Error",
          message: error.message || "Something went wrong",
        });
        setShowModal(true);
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  if (loading) {
    return <GameLoading message="Loading Game" />;
  }

  return (
    <div
      className="
        min-h-screen
        bg-no-repeat
        bg-center
        bg-cover
        sm:bg-contain
      "
      style={{
        backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/teenpatiGameBg.jpg)`,
      }}
    >
      <TeenPattiGame />

      <MessageModal
        show={showModal}
        header={modalMessage.title}
        message={modalMessage.message}
        onClose={() => setShowModal(false)}
      />
    </div>

  );
}

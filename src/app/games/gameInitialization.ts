import ApiService from "@/lib/api/api";
import initSocket from "@/lib/socket/socketClient";
import { setTenantDetails } from "@/lib/redux/slices/tenantDetails";
import { setUserPlayerInfo } from "@/lib/redux/slices/userSlice";
import { gameInitOnce } from "@/lib/gameInitSingleton";
import {
  GameUserInfoResponse,
  TenantDataResponse,
} from "@/app/games/dto/games.dto";
import { AppDispatch } from "@/lib/redux/store";
import { greedyGameTableJoin } from "@/lib/socket/game/greedy/greedySocketEventHandler";

interface GameInitResponse {
  success: boolean;
  error?: string;
}

interface GameInitParams {
  dispatch: AppDispatch;
  tenant: any;
  user: any;
  appKey: string;
  token: string;
  gameId: string;
}

export async function gameInitialization({
  dispatch,
  tenant,
  user,
  appKey,
  token,
  gameId,
}: GameInitParams): Promise<GameInitResponse> {
  try {
    await gameInitOnce(async () => {
      let tenantData = tenant;
      if (!tenantData) {
        const tRes: TenantDataResponse =
          await ApiService.tenantConfigByAppKey(appKey);

        if (!tRes?.success) {
          throw new Error("Tenant not found");
        }

        dispatch(setTenantDetails(tRes.data));
        tenantData = tRes.data;
      }

      let userData = user;
      if (!userData) {
        const baseURL =
          tenantData.environemnt === "production"
            ? tenantData.tenantProductionDomain
            : tenantData.tenantTestingDomain;

        const uRes: GameUserInfoResponse =
          await ApiService.gameUserInfo({
            token,
            tenantDomainURL: baseURL,
          });

        if (!uRes.success) {
          throw new Error(uRes.message || "User fetch failed");
        }

        dispatch(
          setUserPlayerInfo({
            success: true,
            message: uRes.message,
            data: uRes.data,
          })
        );

        userData = uRes.data;
      }

      initSocket({
        userId: userData.id,
        appKey,
        gameId,
        name: userData.name,
        profilePicture: userData.profilePicture,
        token,
        
      });

      setTimeout(() => {
        greedyGameTableJoin({
          userId: userData.id,
          name: userData.name,
          imageProfile: userData.profilePicture,
          appKey,
          token,
          gameId: Number(gameId),

          
        });
      }, 3000);
    });

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Game initialization failed",
    };
  }
}

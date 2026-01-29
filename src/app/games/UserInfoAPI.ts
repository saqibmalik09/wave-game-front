// app/games/hooks/useUserInfo.ts
"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setUserPlayerInfo } from "@/lib/redux/slices/userSlice";
import ApiService from "@/lib/api/api";
import { GameUserInfoResponse } from "@/app/games/dto/games.dto";

export function useUserInfo() {
  const dispatch = useDispatch();
  const tenant = useSelector((s: RootState) => s.tenantDetails.data);

  const loadUser = async (token: string) => {

    if (!tenant) {
      throw new Error("Tenant not loaded");
    }

    const tenantDomainURL =
      tenant.environemnt === "production"
        ? tenant.tenantProductionDomain
        : tenant.tenantTestingDomain;

    const res = await ApiService.gameUserInfo<GameUserInfoResponse>({
      token,
      tenantDomainURL,
    });

    if (!res.success) {
      throw new Error(res.message || "User fetch failed");
    }

    dispatch(
      setUserPlayerInfo({
        success: true,
        message: res.message,
        data: res.data,
      })
    );

    return res.data;
  };

  return { loadUser };
}

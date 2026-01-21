"use client";

import { useEffect, useState } from "react";
import MessageModal from "@/app/components/messageModel";
import GreedyGameUI from "./GreedyGame";

export default function GreedyPages() {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: "",
    message: "",
  });
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const appKey = params.get("appKey");
    const token = params.get("token");
    const gameId = params.get("gameId");

    if (!appKey || !token || !gameId) {
      setModalMessage({
        title: "Invalid Parameters",
        message: "Missing appKey, token, or gameId in URL parameters.",
      });
      setShowModal(true);
      setIsValid(false);
    }
  }, []);

  return (
    <>
      {isValid && <GreedyGameUI />}

      <MessageModal
        show={showModal}
        header={modalMessage.title}
        message={modalMessage.message}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

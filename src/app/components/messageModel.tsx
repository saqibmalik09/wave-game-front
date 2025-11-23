"use client";
import React from "react";

interface MessageModalProps {
  show: boolean;
  header: string;
  message: string;
  onClose?: () => void;
  headerColor?: string;
  messageColor?: string;
  backgroundColor?: string;
}

export default function MessageModal({
  show,
  header,
  message,
  headerColor = "#ffffff",
  messageColor = "#dddddd",
  backgroundColor = "linear-gradient(180deg, #6b1f2b 0%, #4a1520 100%)",
}: MessageModalProps) {
  
  if (!show) return null;

  const reconnect = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={reconnect}
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(6px)",
          zIndex: 100,
          animation: "fadeIn 0.3s ease",
        }}
      />

      {/* Modal */}
      <div
        className="position-fixed top-50 start-50 translate-middle rounded-4 p-4"
        style={{
          width: "90%",
          maxWidth: "420px",
          background: backgroundColor,
          zIndex: 101,
          boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
          animation: "scaleIn 0.3s ease",
        }}
      >
        <h2
          className="fw-bold text-center mb-3"
          style={{ color: headerColor }}
        >
          {header}
        </h2>

        <p
          className="text-center mb-4"
          style={{ color: messageColor, fontSize: "15px" }}
        >
          {message}
        </p>

        <button
          className="btn fw-bold w-100 py-3 rounded-pill"
          style={{
            background: "#ffd700",
            color: "#000",
            border: "none",
          }}
          onClick={reconnect}
        >
          Reconnect
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

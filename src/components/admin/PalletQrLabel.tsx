"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { LabelConfig } from "@/lib/label-settings";
import { DEFAULT_LABEL_CONFIG } from "@/lib/label-settings";

export function PalletQrLabel({
  palletNumber,
  qrData,
  materialType,
  dimensions,
  labelConfig,
}: {
  palletNumber: string;
  qrData?: string;
  materialType?: string;
  dimensions?: string;
  labelConfig?: LabelConfig;
}) {
  const cfg = { ...DEFAULT_LABEL_CONFIG, ...labelConfig };
  const [dataUrl, setDataUrl] = useState<string>("");
  const qrValue = qrData || palletNumber;

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(qrValue, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 130,
      color: { dark: "#020b1a", light: "#ffffff" },
    }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [qrValue]);

  return (
    <div
      className="pallet-label"
      style={{
        width: "180px",
        maxWidth: "100%",
        background: "white",
        border: "2px solid #1e293b",
        borderRadius: "8px",
        padding: "10px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#020b1a",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1.5px solid #e2e8f0",
          paddingBottom: "5px",
          marginBottom: "6px",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 900,
              fontSize: "11px",
              letterSpacing: "-0.02em",
              color: cfg.accentColor,
              lineHeight: 1.2,
            }}
          >
            {cfg.companyName}
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "7px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#94a3b8",
              marginTop: "1px",
            }}
          >
            {cfg.tagline}
          </div>
        </div>
        <div
          style={{
            background: cfg.accentColor,
            color: "white",
            fontWeight: 800,
            fontSize: "7px",
            padding: "2px 5px",
            borderRadius: "3px",
          }}
        >
          QR
        </div>
      </div>

      {/* QR Code */}
      <div style={{ display: "flex", justifyContent: "center", padding: "2px 0" }}>
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt={`QR for ${palletNumber}`}
            style={{
              width: "120px",
              height: "120px",
              display: "block",
              imageRendering: "pixelated",
            }}
          />
        ) : (
          <div
            style={{
              width: "120px",
              height: "120px",
              background: "#f1f5f9",
              borderRadius: "4px",
            }}
          />
        )}
      </div>

      {/* Pallet Number */}
      <div
        style={{
          textAlign: "center",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          fontWeight: 800,
          fontSize: "10px",
          letterSpacing: "0.03em",
          color: "#020b1a",
          marginTop: "4px",
          wordBreak: "break-all",
        }}
      >
        {palletNumber}
      </div>

      {/* Details */}
      {(materialType || dimensions) && (
        <div
          style={{
            borderTop: "1.5px solid #e2e8f0",
            paddingTop: "4px",
            marginTop: "4px",
            textAlign: "center",
          }}
        >
          {materialType && (
            <div style={{ fontWeight: 700, fontSize: "9px", color: "#1e293b", lineHeight: 1.3 }}>
              {materialType.charAt(0).toUpperCase() + materialType.slice(1)} pallet
            </div>
          )}
          {dimensions && (
            <div style={{ fontSize: "8px", color: "#94a3b8", marginTop: "1px" }}>
              {dimensions}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#cbd5e1",
          marginTop: "4px",
        }}
      >
        {cfg.footerText}
      </div>
    </div>
  );
}


import { ImageResponse } from "next/og";
import { MEMORY_CONFIG } from "@/lib/memory-config";

export const runtime = "edge";
export const alt = "BCA — The Last Chapter";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #07090e 0%, #141b2d 50%, #07090e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          color: "#fbf8f1",
          padding: "60px",
          textAlign: "center",
          border: "2px solid rgba(223, 168, 87, 0.3)",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            letterSpacing: "6px",
            color: "#dfa857",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          {MEMORY_CONFIG.collegeName} • {MEMORY_CONFIG.batchName}
        </div>

        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            letterSpacing: "4px",
            color: "#fbf8f1",
            marginBottom: "18px",
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          BCA — THE LAST CHAPTER
        </div>

        <div
          style={{
            width: "120px",
            height: "2px",
            background: "#dfa857",
            marginBottom: "24px",
          }}
        />

        <div
          style={{
            fontSize: "26px",
            fontStyle: "italic",
            color: "#f5d48d",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          &ldquo;Some places become memories. Some people become family.&rdquo;
        </div>

        <div
          style={{
            marginTop: "40px",
            fontSize: "16px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#a49d8f",
          }}
        >
          An Interactive 3D Graduation Memory Experience
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

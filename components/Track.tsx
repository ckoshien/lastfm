import ColorThief from "colorthief";
import { useEffect, useMemo, useState } from "react";
import chroma from "chroma-js";

const Track: React.FC<{
  title: string;
  artist: string;
  imageUrl: string;
  rank: number;
  playcount: number;
}> = ({ title, artist, imageUrl, rank, playcount }) => {
  const [dominant, setDominant] = useState("");
  const [isDark, setIsDark] = useState(true);
  const colorThief = new ColorThief();
  const img: HTMLImageElement | null = document.querySelector(
    "img.image_" + rank
  );
  useEffect(() => {
    let color = null;
    let hex = "";
    let brightness = null;
    try {
      if (!img) return;
      img.addEventListener("load", function () {
        color = colorThief.getColor(img);
        hex = chroma({ r: color[0], g: color[1], b: color[2] }).hex();
        brightness = chroma({
          r: color[0],
          g: color[1],
          b: color[2],
        }).luminance();
        if (brightness < 0.5) {
          setIsDark(false);
        }
        setDominant(hex);
      });
      img.crossOrigin = "Anonymous";
    } catch (error) {
      console.log(error);
    }
  }, [img]);
  return (
    <div
      style={{
        backgroundColor: dominant,
        color: isDark ? "" : "white",
        width: 375,
        height: 100,
        display: "flex",
      }}
    >
      <img
        style={{
          width: 100,
          height: 100
        }}
        src={imageUrl}
        className={"image_" + rank}
      />
      <div
        style={{
          padding:4,
          width:275
        }}
      >
        <div
          style={{
            fontSize:12,
            padding:2
          }}
        >{artist}</div>
        <div
          style={{
            fontSize:16,
            padding:4
          }}
        >{title}</div>
        <div
          style={{
            fontSize:24,
            fontFamily: 'Bebas Neue',
            paddingLeft:8
          }}
        >{playcount}
        <span
          style={{
            fontSize:18
          }}
        >&nbsp;scrobbles</span></div>
      </div>
    </div>
  );
};

export default Track;

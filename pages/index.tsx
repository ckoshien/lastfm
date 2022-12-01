import useSWR from "swr";
import Track from "../components/Track";

const NUM = 20;

export default function Home() {
  const { data } = useSWR(
    "ranking",
    async () => await fetchRanking("")
  );
  const { data: trackData } = useSWR(
    "fetchTracks",
    async () => await fetchTracks(data.toptracks.track.slice(0, NUM))
  );
  if (!data) return <></>;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {data.toptracks.track.slice(0, NUM).map((track: any, idx: number) => (
        <div>
          <Track
            playcount={track.playcount}
            rank={idx + 1}
            title={track.name}
            artist={track.artist.name}
            imageUrl={
              trackData?.[idx]?.track?.album?.image.find((item: any) => {
                return item.size === "extralarge";
              })?.["#text"]
            }
          />
        </div>
      ))}
    </div>
  );
}

const fetchRanking = async (user_name: string) => {
  const response = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user_name}&api_key=${process.env.NEXT_PUBLIC_APIKey}&format=json&period=12month`
  );
  return await response.json();
};

const fetchTracks = async (tracks: any[]) => {
  let resData = [];
  for (let i = 0; i < tracks.length; i++) {
    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${process.env.NEXT_PUBLIC_APIKey}&artist=${tracks[i].artist.name}&track=${tracks[i].name}&format=json`
    );
    const data = await response.json();
    resData.push(data);
  }
  return resData;
};

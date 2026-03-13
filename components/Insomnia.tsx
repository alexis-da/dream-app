import { View } from "@/components/Themed";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

export default function Insomnia() {
  const player = useVideoPlayer(
    "https://www.dropbox.com/scl/fi/hyrn4mh5n3vpdvcdczrc4/videoplayback.mp4?rlkey=mq18gm308c3ye3gxomkjssqvy&st=qhu6ul6m&dl=1",
  );

  useEffect(() => {
    if (player) {
      player.loop = true;
      player.play();
    }
  }, [player]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

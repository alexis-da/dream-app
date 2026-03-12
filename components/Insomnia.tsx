import { VideoView, useVideoPlayer } from "expo-video";
import { StyleSheet } from "react-native";
import { View, Text } from "@/components/Themed";

export default function Insomnia() {
  const player = useVideoPlayer(
    "https://www.dropbox.com/scl/fi/hyrn4mh5n3vpdvcdczrc4/videoplayback.mp4?rlkey=mq18gm308c3ye3gxomkjssqvy&st=qhu6ul6m&dl=1",
    (player) => {
      player.loop = true;
      player.play();
    },
  );

  return (
    <View style={styles.container}>
      <Text>Chill and Sleep</Text>
      <VideoView
        player={player}
        style={styles.video}
        allowsFullscreen
        allowsPictureInPicture
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
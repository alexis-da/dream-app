import Insomnia from "@/components/Insomnia";
import { View } from "@/components/Themed";
import { StyleSheet } from "react-native";

export default function tabInsomnia() {
  return (
    <View style={styles.container}>
      <Insomnia />
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

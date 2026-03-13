import DreamSearch from "@/components/DreamSearch";
import { View } from "@/components/Themed";
import { StyleSheet } from "react-native";

export default function TabThreeScreen() {
  return (
    <View style={styles.container}>
      <DreamSearch />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

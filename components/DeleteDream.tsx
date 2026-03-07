import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text } from "react-native-paper";

export function DeleteDream({
  dreamId,
  onDelete,
}: {
  dreamId: string;
  onDelete: () => void;
}) {
  const handleDelete = async () => {
    try {
      const data = await AsyncStorage.getItem("dreamFormDataArray");
      const dreamFormDataArray = data ? JSON.parse(data) : [];
      const updatedDreams = dreamFormDataArray.filter(
        (dream: any) => dream.id !== dreamId,
      );
      await AsyncStorage.setItem(
        "dreamFormDataArray",
        JSON.stringify(updatedDreams),
      );
      onDelete(); // Appeler la fonction de rappel pour rafraîchir la liste des rêves
    } catch (error) {
      console.error("Erreur lors de la suppression du rêve:", error);
    } finally {
      console.log("Suppression du rêve terminée.");
    }
  };

  return (
    <Button onPress={handleDelete} style={styles.deleteButton}>
      <Text style={styles.deleteButtonText}>Supprimer</Text>
    </Button>
  );
}

const styles = {
  deleteButton: {
    backgroundColor: "#ff4d4d",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
  },
};

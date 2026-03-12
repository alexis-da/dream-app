import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { DeleteDream } from "./DeleteDream";
import EditDream from "./EditDream";

export default function DreamList() {
  const [dreams, setDreams] = useState([]);
  const [editingDreamId, setEditingDreamId] = useState<string | null>(null);

  // Ce useEffect est exécuté à l'instanciation du composant pour charger la liste initiale
  const fetchDreams = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("dreamFormDataArray");
      const dreamFormDataArray = data ? JSON.parse(data) : [];
      setDreams(dreamFormDataArray);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }, []);

  useEffect(() => {
    fetchDreams();
  }, [fetchDreams]);

  return (
    <ScrollView style={styles.container}>
      {editingDreamId ? (
        <EditDream
          dreamId={editingDreamId}
          onSave={() => {
            setEditingDreamId(null);
            fetchDreams();
          }}
          onCancel={() => setEditingDreamId(null)}
        />
      ) : (
        <>
          <Text style={styles.title}>Liste des Rêves :</Text>
          {dreams.map((dream, index) => (
            <ScrollView key={index} style={styles.dreamContainer}>
              <Text style={styles.dreamText}>
                {dream.dreamText} -{" "}
                {dream.isLucidDream ? "Lucide" : "Non Lucide"} -{" "}
                {dream.dreamType}
                <br />
                Hashtags:
                <br />
                {dream.hashtags.map((hashtag, id) => (
                  <Text key={id}>{hashtag.label},</Text>
                ))}
                {"\n"}
                Date: {dream.dateTime?.date || "N/A"} - Heure:{" "}
                {dream.dateTime?.time || "N/A"}
                <br />
                <Text>Emotion: {dream.emotionState}</Text>
                <br />
                <Text>
                  Personne:{" "}
                  {dream.peoples.map((person) => person.name).join(", ")}
                </Text>
                <br />
                <Text>Lieu: {dream.place}</Text>
                <br />
                <Text>Intensité émotionnelle: {dream.emotionnalIntensity}</Text>
                <br />
                <Text>Clarté du rêve: {dream.dreamClarity}</Text>
                <br />
                <Text>Qualité du sommeil: {dream.sleepQuality}</Text>
                <br />
                <Text>Signification personnelle: {dream.presonalMeaning}</Text>
                <br />
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => setEditingDreamId(dream.id)}
                  style={styles.editButton}
                >
                  Modifier
                </Button>
                <DeleteDream
                  dreamId={dream.id}
                  onDelete={() =>
                    setDreams(dreams.filter((d) => d.id !== dream.id))
                  }
                />
              </View>
            </ScrollView>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dreamText: {
    fontSize: 16,
    marginBottom: 4,
  },
  dreamContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  editButton: {
    flex: 1,
  },
});

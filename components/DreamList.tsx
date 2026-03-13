import { DreamTheme } from "@/constants/DreamTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { DeleteDream } from "./DeleteDream";
import EditDream from "./EditDream";

export default function DreamList() {
  const [dreams, setDreams] = useState([]);
  const [editingDreamId, setEditingDreamId] = useState<string | null>(null);

  // Ce useCallback est exécuté pour charger la liste des rêves
  const fetchDreams = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("dreamFormDataArray");
      const parsed = data ? JSON.parse(data) : [];
      const dreamFormDataArray = Array.isArray(parsed) ? parsed : [];
      setDreams(dreamFormDataArray);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }, []);

  // Se déclenche chaque fois qu'on revient à cet onglet
  useFocusEffect(
    useCallback(() => {
      fetchDreams();
    }, [fetchDreams]),
  );

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
          {dreams.length === 0 ? (
            <Text style={styles.emptyText}>
              Aucun rêve enregistré pour le moment.
            </Text>
          ) : (
            dreams.map((dream) => (
              <View key={dream.id} style={styles.dreamContainer}>
                <Text style={styles.dreamText}>
                  {dream.dreamText} - {dream.isLucidDream ? "Lucide" : "Non Lucide"} - {dream.dreamType}
                </Text>
                
                <Text style={styles.sectionTitle}>Hashtags:</Text>
                <Text style={styles.dreamText}>
                  {dream.hashtags.map((hashtag) => hashtag.label).join(", ")}
                </Text>

                <Text style={styles.dreamText}>
                  Date: {dream.dateTime?.date || "N/A"} - Heure: {dream.dateTime?.time || "N/A"}
                </Text>

                <Text style={styles.dreamText}>Emotion: {dream.emotionState}</Text>

                <Text style={styles.dreamText}>
                  Personne: {dream.peoples.map((person) => person.name).join(", ")}
                </Text>

                <Text style={styles.dreamText}>Lieu: {dream.place}</Text>

                <Text style={styles.dreamText}>
                  Intensité émotionnelle: {dream.emotionnalIntensity}
                </Text>

                <Text style={styles.dreamText}>Clarté du rêve: {dream.dreamClarity}</Text>

                <Text style={styles.dreamText}>Qualité du sommeil: {dream.sleepQuality}</Text>

                <Text style={styles.dreamText}>
                  Signification personnelle: {dream.presonalMeaning}
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
              </View>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DreamTheme.colors.background,
    paddingHorizontal: DreamTheme.spacing.lg,
    paddingTop: DreamTheme.spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: DreamTheme.spacing.lg,
    color: DreamTheme.colors.gold,
    letterSpacing: 0.5,
  },
  dreamText: {
    fontSize: 15,
    marginBottom: DreamTheme.spacing.sm,
    color: DreamTheme.colors.textPrimary,
  },
  dreamContainer: {
    borderWidth: 1,
    borderColor: DreamTheme.colors.cardBorder,
    borderRadius: DreamTheme.borderRadius.lg,
    padding: DreamTheme.spacing.lg,
    marginBottom: DreamTheme.spacing.lg,
    backgroundColor: DreamTheme.colors.card,
    ...DreamTheme.shadow,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: DreamTheme.spacing.sm,
    marginTop: DreamTheme.spacing.md,
  },
  editButton: {
    flex: 1,
  },
  emptyText: {
    marginTop: DreamTheme.spacing.xl,
    textAlign: "center",
    color: DreamTheme.colors.textMuted,
    fontSize: 15,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: DreamTheme.spacing.md,
    marginBottom: DreamTheme.spacing.sm,
    color: DreamTheme.colors.gold,
  },
});

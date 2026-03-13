import { DreamTheme } from "@/constants/DreamTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function DreamSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const data = await AsyncStorage.getItem("dreamFormDataArray");
      const dreamFormDataArray = data ? JSON.parse(data) : [];
      const searchLower = searchTerm.toLowerCase();

      const results = dreamFormDataArray.filter(
        (dream) =>
          // Recherche dans les hashtags
          dream.hashtags.some((hashtag) =>
            hashtag.label.toLowerCase().includes(searchLower),
          ) ||
          // Recherche dans les personnes
          dream.peoples.some((person) =>
            person.name.toLowerCase().includes(searchLower),
          ) ||
          // Recherche dans le type de rêve
          dream.dreamType.toLowerCase().includes(searchLower) ||
          // Recherche par émotion
          dream.emotionState.toLowerCase().includes(searchLower) ||
          // Recherche dans le texte du rêve
          dream.dreamText.toLowerCase().includes(searchLower),
      );

      setSearchResults(results);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setSearchTerm("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recherche de Rêves :</Text>
      <View style={styles.searchContainer}>
        <Text style={styles.label}>
          Recherchez par hashtag, personne ou mot-clé :
        </Text>
        <TextInput
          style={styles.input}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Ex: #nature, Alice, peur..."
        />
        <Button mode="contained" onPress={handleSearch} style={styles.button}>
          Rechercher
        </Button>
      </View>
      <ScrollView
        style={styles.resultsContainer}
        contentContainerStyle={styles.resultsContent}
        showsVerticalScrollIndicator={false}
      >
        {searchResults.map((dream: any, index) => (
          <View key={index} style={styles.resultItem}>
            <Text style={styles.resultText}>{dream.dreamText}</Text>
            <Text style={styles.resultSubText}>
              {dream.isLucidDream ? "Lucide" : "Non Lucide"} - {dream.dreamType}
            </Text>
            <Text style={styles.resultSubText}>
              Hashtags: {dream.hashtags.map((h) => h.label).join(", ")}
            </Text>
            <Text style={styles.resultSubText}>
              Personnes: {dream.peoples.map((p) => p.name).join(", ")}
            </Text>
            <Text style={styles.resultSubText}>
              Date: {dream.dateTime?.date || "N/A"} - Heure:{" "}
              {dream.dateTime?.time || "N/A"}
            </Text>
            <Text style={styles.resultSubText}>
              Emotion: {dream.emotionState}
            </Text>
            <Text style={styles.resultSubText}>Lieu: {dream.place}</Text>
            <Text style={styles.resultSubText}>
              Intensité émotionnelle: {dream.emotionnalIntensity}
            </Text>
            <Text style={styles.resultSubText}>
              Clarté du rêve: {dream.dreamClarity}
            </Text>
            <Text style={styles.resultSubText}>
              Qualité du sommeil: {dream.sleepQuality}
            </Text>
            <Text style={styles.resultSubText}>
              Signification personnelle: {dream.presonalMeaning}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DreamTheme.colors.background,
    padding: DreamTheme.spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: DreamTheme.spacing.lg,
    color: DreamTheme.colors.gold,
    alignSelf: "flex-start",
    letterSpacing: 0.5,
  },
  searchContainer: {
    width: "100%",
    marginBottom: DreamTheme.spacing.lg,
    backgroundColor: DreamTheme.colors.card,
    borderRadius: DreamTheme.borderRadius.lg,
    padding: DreamTheme.spacing.lg,
    borderWidth: 1,
    borderColor: DreamTheme.colors.cardBorder,
    ...DreamTheme.shadow,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: DreamTheme.spacing.sm,
    color: DreamTheme.colors.accent,
  },
  input: {
    marginBottom: DreamTheme.spacing.md,
  },
  button: {
    width: "100%",
  },
  resultsContainer: {
    width: "100%",
    flex: 1,
  },
  resultsContent: {
    paddingBottom: DreamTheme.spacing.xl,
  },
  resultItem: {
    borderWidth: 1,
    borderColor: DreamTheme.colors.cardBorder,
    borderRadius: DreamTheme.borderRadius.lg,
    padding: DreamTheme.spacing.lg,
    marginBottom: DreamTheme.spacing.md,
    backgroundColor: DreamTheme.colors.card,
    ...DreamTheme.shadow,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: DreamTheme.spacing.sm,
    color: DreamTheme.colors.accent,
  },
  resultSubText: {
    fontSize: 13,
    color: DreamTheme.colors.textSecondary,
    marginBottom: 2,
  },
});

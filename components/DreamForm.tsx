import { DreamTheme } from "@/constants/DreamTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Checkbox,
  Divider,
  SegmentedButtons,
  TextInput,
} from "react-native-paper";
import { Rating } from "react-native-ratings";
import uuid from "react-native-uuid";

const { width } = Dimensions.get("window");

const findHashtagIdByLabel = async (hashtag: string) => {
  try {
    // Récupère les données des rêves stockées dans le AsyncStorage
    const existingDreams = await AsyncStorage.getItem("dreamFormDataArray");
    let dreamsData = existingDreams ? JSON.parse(existingDreams) : [];

    // Parcours tous les rêves pour trouver un hashtag existant
    for (let dream of dreamsData) {
      for (let hashtagKey in dream.hashtags) {
        const hashtagStored = dream.hashtags[hashtagKey];

        if (hashtagStored.label === hashtag.toLocaleLowerCase()) {
          return hashtagStored.id;
        }
      }
    }

    // Si le hashtag n'existe pas, crée un nouvel ID
    const newId = uuid.v4();
    return newId;
  } catch (error) {
    console.error("Erreur lors de la gestion des hashtags:", error);
    return null;
  }
};

export default function DreamForm() {
  const [dreamText, setDreamText] = useState("");
  const [isLucidDream, setIsLucidDream] = useState(false);
  const [dreamType, setDreamType] = useState("neutre");
  const [hashtag1, setHashtag1] = useState("");
  const [hashtag2, setHashtag2] = useState("");
  const [hashtag3, setHashtag3] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState("date");
  const [emotionState, setEmotionState] = useState("neutre");
  const [peoples, setPeoples] = useState([]);
  const [peopleInput, setPeopleInput] = useState("");
  const [place, setPlace] = useState("");
  const [emotionnalIntensity, setEmotionnalIntensity] = useState(0);
  const [dreamClarity, setDreamClarity] = useState(0);
  const [sleepQuality, setSleepQuality] = useState(0);
  const [personalMeaning, setPersonalMeaning] = useState("");

  const showDateTimePicker = () => {
    setMode("date");
    setShowPicker(true);
  };

  const handlePeopleInputChange = (text: string) => {
    // Détecte si l'utilisateur a tapé une virgule
    if (text.includes(",")) {
      const peopleName = text.replace(",", "").trim();

      // Ajoute la personne si le nom n'est pas vide
      if (peopleName.length > 0) {
        const newPerson = {
          id: uuid.v4(),
          name: peopleName,
        };
        setPeoples([...peoples, newPerson]);
      }

      // Réinitialise le champs
      setPeopleInput("");
    } else {
      setPeopleInput(text);
    }
  };

  const handleRemovePerson = (personId: string) => {
    setPeoples(peoples.filter((person) => person.id !== personId));
  };

  const onChange = (event: any, selectedValue: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (mode === "date") {
      setDate(selectedValue);
      setMode("time");
    } else {
      setTime(selectedValue);
      setShowPicker(false);
    }
  };

  const handleDreamSubmission = async () => {
    try {
      // Récupérer le tableau actuel depuis AsyncStorage
      const existingData = await AsyncStorage.getItem("dreamFormDataArray");
      const formDataArray = existingData ? JSON.parse(existingData) : [];

      const hashtag1Id = await findHashtagIdByLabel(hashtag1);
      const hashtag2Id = await findHashtagIdByLabel(hashtag2);
      const hashtag3Id = await findHashtagIdByLabel(hashtag3);

      // Ajouter le nouveau formulaire au tableau
      formDataArray.push({
        id: uuid.v4(),
        dreamText: dreamText,
        isLucidDream: isLucidDream,
        dreamType: dreamType,
        hashtags: [
          { id: hashtag1Id, label: hashtag1.toLocaleLowerCase() },
          { id: hashtag2Id, label: hashtag2.toLocaleLowerCase() },
          { id: hashtag3Id, label: hashtag3.toLocaleLowerCase() },
        ],
        dateTime: {
          date: date.toISOString().split("T")[0],
          time: time.toTimeString().slice(0, 5),
        },
        emotionState: emotionState,
        peoples: peoples,
        place: place,
        emotionnalIntensity: emotionnalIntensity,
        dreamClarity: dreamClarity,
        sleepQuality: sleepQuality,
        personalMeaning: personalMeaning,
      });

      // Sauvegarder le tableau mis à jour dans AsyncStorage
      await AsyncStorage.setItem(
        "dreamFormDataArray",
        JSON.stringify(formDataArray),
      );

      console.log(
        "AsyncStorage: ",
        JSON.parse((await AsyncStorage.getItem("dreamFormDataArray")) || "[]"),
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données:", error);
    }

    setDreamText("");
    setIsLucidDream(false);
    setDreamType("neutre");
    setHashtag1("");
    setHashtag2("");
    setHashtag3("");
    setDate(new Date());
    setTime(new Date());
    setEmotionState("neutre");
    setPeoples([]);
    setPeopleInput("");
    setPlace("");
    setEmotionnalIntensity(0);
    setDreamClarity(0);
    setSleepQuality(0);
    setPersonalMeaning("");
  };

  const resetDreams = async () => {
    try {
      await AsyncStorage.setItem("dreamFormDataArray", JSON.stringify([]));
      console.log(
        "AsyncStorage: ",
        JSON.parse((await AsyncStorage.getItem("dreamFormDataArray")) || "[]"),
      );
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des données:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Rêve"
        value={dreamText}
        onChangeText={(text) => setDreamText(text)}
        mode="outlined"
        multiline
        numberOfLines={6}
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <Divider style={styles.divider} />

      <Text>
        Date : {date.toLocaleDateString()} - Heure : {time.toLocaleTimeString()}
      </Text>

      <Button mode="outlined" onPress={showDateTimePicker}>
        Choisir date et heure
      </Button>

      {showPicker && (
        <DateTimePicker
          value={mode === "date" ? date : time}
          mode={mode}
          display="default"
          onChange={onChange}
        />
      )}

      <View style={styles.checkboxContainer}>
        <Checkbox.Item
          label="Rêve Lucide"
          status={isLucidDream ? "checked" : "unchecked"}
          onPress={() => setIsLucidDream(!isLucidDream)}
        />
      </View>

      <Divider style={styles.divider} />

      <SegmentedButtons
        style={{ marginBottom: 16 }}
        value={dreamType}
        onValueChange={setDreamType}
        buttons={[
          {
            value: "cauchemar",
            label: "Cauchemar",
          },
          {
            value: "reve",
            label: "Rêve",
          },
          { value: "neutre", label: "Neutre" },
        ]}
      />

      <Divider style={styles.divider} />

      <Text style={styles.label}>Personnes présentes dans le rêve</Text>

      {peoples.length > 0 && (
        <View style={styles.peopleListContainer}>
          {peoples.map((person) => (
            <View key={person.id} style={styles.personTag}>
              <Text style={styles.personName}>{person.name}</Text>
              <Button
                mode="text"
                onPress={() => handleRemovePerson(person.id)}
                compact
                style={styles.removeButton}
              >
                ✕
              </Button>
            </View>
          ))}
        </View>
      )}

      <TextInput
        label="Ajouter une personne (tapez une virgule pour confirmer)"
        value={peopleInput}
        onChangeText={handlePeopleInputChange}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <Text style={styles.label}>Lieu du rêve</Text>
      <TextInput
        label="Lieu"
        value={place}
        onChangeText={(place) => setPlace(place)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <Text style={styles.label}>État émotionnel</Text>
      <Picker
        selectedValue={emotionState}
        onValueChange={(itemValue) => setEmotionState(itemValue)}
      >
        <Picker.Item label="Neutre" value="neutre" />
        <Picker.Item label="Heureux" value="heureux" />
        <Picker.Item label="Appeuré" value="appeuré" />
        <Picker.Item label="Mécontent" value="mécontant" />
      </Picker>

      <Divider style={styles.divider} />

      <Text style={styles.label}>Intensité émotionnelle</Text>

      <Rating
        type="star"
        ratingColor="#3498db"
        ratingBackgroundColor="#c8c7c8"
        ratingCount={5}
        startingValue={emotionnalIntensity}
        onFinishRating={(rating) => setEmotionnalIntensity(rating)}
      />

      <Divider style={styles.divider} />

      <Text style={styles.label}>Clarté du rêve</Text>
      <Rating
        type="star"
        ratingColor="#3498db"
        ratingBackgroundColor="#c8c7c8"
        ratingCount={5}
        startingValue={dreamClarity}
        onFinishRating={(rating) => setDreamClarity(rating)}
      />

      <Divider style={styles.divider} />

      <Text style={styles.label}>Qualité du sommeil</Text>
      <Rating
        type="star"
        ratingColor="#3498db"
        ratingBackgroundColor="#c8c7c8"
        ratingCount={5}
        startingValue={sleepQuality}
        onFinishRating={(rating) => setSleepQuality(rating)}
      />

      <Divider style={styles.divider} />
      <Text style={styles.label}>Signification personnelle</Text>
      <TextInput
        label="Signification personnelle"
        value={personalMeaning}
        onChangeText={(personalMeaning) => setPersonalMeaning(personalMeaning)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <Divider style={styles.divider} />

      <TextInput
        label="Hashtag 1"
        value={hashtag1}
        onChangeText={(hashtag1) => setHashtag1(hashtag1)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <TextInput
        label="Hashtag 2"
        value={hashtag2}
        onChangeText={(hashtag2) => setHashtag2(hashtag2)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <TextInput
        label="Hashtag 3"
        value={hashtag3}
        onChangeText={(hashtag3) => setHashtag3(hashtag3)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <Button
        mode="contained"
        onPress={handleDreamSubmission}
        style={styles.button}
      >
        Soumettre
      </Button>
      <Button mode="outlined" onPress={resetDreams} style={styles.button}>
        Réinitialiser les rêves
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DreamTheme.colors.background,
    padding: DreamTheme.spacing.lg,
  },
  input: {
    marginBottom: DreamTheme.spacing.lg,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: DreamTheme.spacing.lg,
    backgroundColor: DreamTheme.colors.card,
    borderRadius: DreamTheme.borderRadius.lg,
    paddingHorizontal: DreamTheme.spacing.md,
  },
  button: {
    marginTop: DreamTheme.spacing.md,
  },
  divider: {
    marginVertical: DreamTheme.spacing.xl,
    backgroundColor: DreamTheme.colors.cardBorder,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: DreamTheme.spacing.md,
    marginLeft: DreamTheme.spacing.md,
    color: DreamTheme.colors.accent,
  },
  peopleListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: DreamTheme.spacing.md,
    gap: DreamTheme.spacing.sm,
  },
  personTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DreamTheme.colors.primaryLight,
    borderRadius: DreamTheme.borderRadius.round,
    paddingHorizontal: DreamTheme.spacing.md,
    paddingVertical: DreamTheme.spacing.sm,
    borderWidth: 1,
    borderColor: DreamTheme.colors.cardBorder,
  },
  personName: {
    marginRight: DreamTheme.spacing.sm,
    fontSize: 14,
    color: DreamTheme.colors.accent,
    fontWeight: "600",
  },
  removeButton: {
    margin: 0,
    padding: 0,
    minWidth: "auto",
  },
  raiting: {
    backgroundColor: DreamTheme.colors.background,
  }
});

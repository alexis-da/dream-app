import { DreamTheme } from "@/constants/DreamTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import uuid from "react-native-uuid";
import BasicsSection from "./dream-form/BasicsSection.tsx";
import EmotionSection from "./dream-form/EmotionSection.tsx";
import HashtagsSection from "./dream-form/HashtagsSection.tsx";
import PeopleSection from "./dream-form/PeopleSection.tsx";

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
      <BasicsSection
        styles={styles}
        width={width}
        dreamText={dreamText}
        setDreamText={setDreamText}
        date={date}
        time={time}
        showDateTimePicker={showDateTimePicker}
        showPicker={showPicker}
        mode={mode}
        onChange={onChange}
        isLucidDream={isLucidDream}
        setIsLucidDream={setIsLucidDream}
        dreamType={dreamType}
        setDreamType={setDreamType}
      />

      <PeopleSection
        styles={styles}
        width={width}
        peoples={peoples}
        handleRemovePerson={handleRemovePerson}
        peopleInput={peopleInput}
        handlePeopleInputChange={handlePeopleInputChange}
        place={place}
        setPlace={setPlace}
      />

      <EmotionSection
        styles={styles}
        width={width}
        emotionState={emotionState}
        setEmotionState={setEmotionState}
        emotionnalIntensity={emotionnalIntensity}
        setEmotionnalIntensity={setEmotionnalIntensity}
        dreamClarity={dreamClarity}
        setDreamClarity={setDreamClarity}
        sleepQuality={sleepQuality}
        setSleepQuality={setSleepQuality}
        personalMeaning={personalMeaning}
        setPersonalMeaning={setPersonalMeaning}
      />

      <HashtagsSection
        styles={styles}
        width={width}
        hashtag1={hashtag1}
        setHashtag1={setHashtag1}
        hashtag2={hashtag2}
        setHashtag2={setHashtag2}
        hashtag3={hashtag3}
        setHashtag3={setHashtag3}
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
  },
});

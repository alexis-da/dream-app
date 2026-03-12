import { DreamTheme } from "@/constants/DreamTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Checkbox,
  Divider,
  SegmentedButtons,
  TextInput,
} from "react-native-paper";
import uuid from "react-native-uuid";

const { width } = Dimensions.get("window");

const findHashtagIdByLabel = async (hashtag) => {
  try {
    const existingDreams = await AsyncStorage.getItem("dreamFormDataArray");
    let dreamsData = existingDreams ? JSON.parse(existingDreams) : [];

    for (let dream of dreamsData) {
      for (let hashtagKey in dream.hashtags) {
        const hashtagStored = dream.hashtags[hashtagKey];

        if (hashtagStored.label === hashtag.toLocaleLowerCase()) {
          return hashtagStored.id;
        }
      }
    }

    const newId = uuid.v4();
    return newId;
  } catch (error) {
    console.error("Erreur lors de la gestion des hashtags:", error);
    return null;
  }
};

export default function EditDream({ dreamId, onSave, onCancel }) {
  const [dream, setDream] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const [presonalMeaning, setPresonalMeaning] = useState("");

  // Charger le rêve à l'initialisation
  useEffect(() => {
    const loadDream = async () => {
      try {
        const data = await AsyncStorage.getItem("dreamFormDataArray");
        const dreamsArray = data ? JSON.parse(data) : [];
        const foundDream = dreamsArray.find((d) => d.id === dreamId);

        if (foundDream) {
          setDream(foundDream);
          // Remplir tous les champs avec les données existantes
          setDreamText(foundDream.dreamText);
          setIsLucidDream(foundDream.isLucidDream);
          setDreamType(foundDream.dreamType);
          setHashtag1(foundDream.hashtags[0]?.label || "");
          setHashtag2(foundDream.hashtags[1]?.label || "");
          setHashtag3(foundDream.hashtags[2]?.label || "");
          setPeoples(foundDream.peoples);
          setPlace(foundDream.place);
          setEmotionState(foundDream.emotionState);
          setEmotionnalIntensity(foundDream.emotionnalIntensity);
          setDreamClarity(foundDream.dreamClarity);
          setSleepQuality(foundDream.sleepQuality);
          setPresonalMeaning(foundDream.presonalMeaning);

          const [year, month, day] = foundDream.dateTime.date.split("-");
          const [hours, minutes] = foundDream.dateTime.time.split(":");
          const newDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
          );
          const newTime = new Date();
          newTime.setHours(parseInt(hours), parseInt(minutes));

          setDate(newDate);
          setTime(newTime);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du rêve:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDream();
  }, [dreamId]);

  const showDateTimePicker = () => {
    setMode("date");
    setShowPicker(true);
  };

  const handlePeopleInputChange = (text) => {
    if (text.includes(",")) {
      const peopleName = text.replace(",", "").trim();

      if (peopleName.length > 0) {
        const newPerson = {
          id: uuid.v4(),
          name: peopleName,
        };
        setPeoples([...peoples, newPerson]);
      }

      setPeopleInput("");
    } else {
      setPeopleInput(text);
    }
  };

  const handleRemovePerson = (personId) => {
    setPeoples(peoples.filter((person) => person.id !== personId));
  };

  const onChange = (event, selectedValue) => {
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

  const handleDreamUpdate = async () => {
    try {
      const existingData = await AsyncStorage.getItem("dreamFormDataArray");
      const formDataArray = existingData ? JSON.parse(existingData) : [];

      const hashtag1Id = await findHashtagIdByLabel(hashtag1);
      const hashtag2Id = await findHashtagIdByLabel(hashtag2);
      const hashtag3Id = await findHashtagIdByLabel(hashtag3);

      // Trouver et mettre à jour le rêve existant
      const updatedArray = formDataArray.map((d) =>
        d.id === dreamId
          ? {
              ...d,
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
              presonalMeaning: presonalMeaning,
            }
          : d,
      );

      await AsyncStorage.setItem(
        "dreamFormDataArray",
        JSON.stringify(updatedArray),
      );

      console.log("Rêve mis à jour avec succès");
      onSave?.();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rêve:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement du rêve...</Text>
      </View>
    );
  }

  if (!dream) {
    return (
      <View style={styles.container}>
        <Text>Rêve non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Modifier le rêve</Text>

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
        onChangeText={(newPlace) => setPlace(newPlace)}
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
      <Picker
        selectedValue={emotionnalIntensity}
        onValueChange={(itemValue) => setEmotionnalIntensity(itemValue)}
      >
        <Picker.Item label="0" value={0} />
        <Picker.Item label="1" value={1} />
        <Picker.Item label="2" value={2} />
        <Picker.Item label="3" value={3} />
        <Picker.Item label="4" value={4} />
        <Picker.Item label="5" value={5} />
        <Picker.Item label="6" value={6} />
        <Picker.Item label="7" value={7} />
        <Picker.Item label="8" value={8} />
        <Picker.Item label="9" value={9} />
        <Picker.Item label="10" value={10} />
      </Picker>

      <Divider style={styles.divider} />

      <Text style={styles.label}>Clarté du rêve</Text>
      <Picker
        selectedValue={dreamClarity}
        onValueChange={(itemValue) => setDreamClarity(itemValue)}
      >
        <Picker.Item label="0" value={0} />
        <Picker.Item label="1" value={1} />
        <Picker.Item label="2" value={2} />
        <Picker.Item label="3" value={3} />
        <Picker.Item label="4" value={4} />
        <Picker.Item label="5" value={5} />
        <Picker.Item label="6" value={6} />
        <Picker.Item label="7" value={7} />
        <Picker.Item label="8" value={8} />
        <Picker.Item label="9" value={9} />
        <Picker.Item label="10" value={10} />
      </Picker>

      <Divider style={styles.divider} />

      <Text style={styles.label}>Qualité du sommeil</Text>
      <Picker
        selectedValue={sleepQuality}
        onValueChange={(itemValue) => setSleepQuality(itemValue)}
      >
        <Picker.Item label="0" value={0} />
        <Picker.Item label="1" value={1} />
        <Picker.Item label="2" value={2} />
        <Picker.Item label="3" value={3} />
        <Picker.Item label="4" value={4} />
        <Picker.Item label="5" value={5} />
      </Picker>

      <Divider style={styles.divider} />

      <Text style={styles.label}>Signification personnelle</Text>
      <TextInput
        label="Signification personnelle"
        value={presonalMeaning}
        onChangeText={(personalMeaning) => setPresonalMeaning(personalMeaning)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <Divider style={styles.divider} />

      <TextInput
        label="Hashtag 1"
        value={hashtag1}
        onChangeText={(newHashtag1) => setHashtag1(newHashtag1)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <TextInput
        label="Hashtag 2"
        value={hashtag2}
        onChangeText={(newHashtag2) => setHashtag2(newHashtag2)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <TextInput
        label="Hashtag 3"
        value={hashtag3}
        onChangeText={(newHashtag3) => setHashtag3(newHashtag3)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <Button
        mode="contained"
        onPress={handleDreamUpdate}
        style={styles.button}
      >
        Sauvegarder les modifications
      </Button>

      {onCancel && (
        <Button mode="outlined" onPress={onCancel} style={styles.button}>
          Annuler
        </Button>
      )}
    </ScrollView>
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
    letterSpacing: 0.5,
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
    marginTop: DreamTheme.spacing.sm,
    marginBottom: DreamTheme.spacing.sm,
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
});

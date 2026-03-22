import { Picker } from "@react-native-picker/picker";
import { Text } from "react-native";
import { Divider, TextInput } from "react-native-paper";
import { Rating } from "react-native-ratings";

export default function EmotionSection({
  styles,
  width,
  emotionState,
  setEmotionState,
  emotionnalIntensity,
  setEmotionnalIntensity,
  dreamClarity,
  setDreamClarity,
  sleepQuality,
  setSleepQuality,
  personalMeaning,
  setPersonalMeaning,
}) {
  return (
    <>
      <Text style={styles.label}>État émotionnel</Text>
      <Picker
        selectedValue={emotionState}
        onValueChange={(itemValue) => setEmotionState(itemValue)}
      >
        <Picker.Item label="Neutre" value="neutre" />
        <Picker.Item label="Heureux" value="heureux" />
        <Picker.Item label="Apeuré" value="apeuré" />
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
        onChangeText={(nextPersonalMeaning) =>
          setPersonalMeaning(nextPersonalMeaning)
        }
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <Divider style={styles.divider} />
    </>
  );
}

import React from "react";
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function PeopleSection({
  styles,
  width,
  peoples,
  handleRemovePerson,
  peopleInput,
  handlePeopleInputChange,
  place,
  setPlace,
}) {
  return (
    <>
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
    </>
  );
}

import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Text, View } from "react-native";
import {
  Button,
  Checkbox,
  Divider,
  SegmentedButtons,
  TextInput,
} from "react-native-paper";

export default function BasicsSection({
  styles,
  width,
  dreamText,
  setDreamText,
  date,
  time,
  showDateTimePicker,
  showPicker,
  mode,
  onChange,
  isLucidDream,
  setIsLucidDream,
  dreamType,
  setDreamType,
}) {
  return (
    <>
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
    </>
  );
}

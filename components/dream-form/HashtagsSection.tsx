import React from "react";
import { TextInput } from "react-native-paper";

export default function HashtagsSection({
  styles,
  width,
  hashtag1,
  setHashtag1,
  hashtag2,
  setHashtag2,
  hashtag3,
  setHashtag3,
}) {
  return (
    <>
      <TextInput
        label="Hashtag 1"
        value={hashtag1}
        onChangeText={(nextHashtag1) => setHashtag1(nextHashtag1)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <TextInput
        label="Hashtag 2"
        value={hashtag2}
        onChangeText={(nextHashtag2) => setHashtag2(nextHashtag2)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <TextInput
        label="Hashtag 3"
        value={hashtag3}
        onChangeText={(nextHashtag3) => setHashtag3(nextHashtag3)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />
    </>
  );
}

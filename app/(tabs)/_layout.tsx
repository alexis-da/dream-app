import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Formulaire de rêve",
          tabBarIcon: ({ color }) => <FontAwesome name="wpforms" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Liste des rêves",
          tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: "Recherche de rêves",
          tabBarIcon: ({ color }) => <FontAwesome name="search" size={24} color="black" />,
          
        }}
      />
      <Tabs.Screen
        name="insomnia" 
        options={{
          title: "Insomnie",
          tabBarIcon: ({ color }) => <FontAwesome name="moon-o" size={24} color="black" />,
        }}
        
      />
    </Tabs>
  );
}

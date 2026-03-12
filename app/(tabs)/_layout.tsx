import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import { DreamTheme } from "@/constants/DreamTheme";

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
        tabBarActiveTintColor: DreamTheme.colors.primary,
        tabBarInactiveTintColor: DreamTheme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: DreamTheme.colors.surface,
          borderTopColor: DreamTheme.colors.cardBorder,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: DreamTheme.colors.surface,
        },
        headerTintColor: DreamTheme.colors.textPrimary,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Formulaire de rêve",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="wpforms" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Liste des rêves",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: "Recherche de rêves",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="insomnia"
        options={{
          title: "Insomnie",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="moon-o" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}

import { HomeTopBar } from "@/components/HomeTopBar";
import { Colors } from "@/constants/colors";
import { BodegaHomePage } from "@/modules/bodega/components/home-page";
import { EventoHomePage } from "@/modules/evento/components/home-page";
import { RecorridosHomePage } from "@/modules/recorridos/components/home-page";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const { tab = "eventos" } = useLocalSearchParams<{ tab: string }>();

  const RenderContent = useMemo(() => {
    switch (tab) {
      case "bodegas":
        return BodegaHomePage;
      case "recorridos":
        return RecorridosHomePage;
      case "eventos":
      default:
        return EventoHomePage;
    }
  }, [tab]);

  return (
    <View style={styles.container}>
      <HomeTopBar current={tab as "eventos" | "bodegas" | "recorridos"} />
      <RenderContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});

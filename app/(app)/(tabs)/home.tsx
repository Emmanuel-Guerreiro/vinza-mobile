import { HomeTopBar } from "@/components/HomeTopBar";
import { Colors } from "@/constants/colors";
import { BodegaHomePage } from "@/modules/bodega/components/home-page";
import { EventoHomePage } from "@/modules/evento/components/home-page";
import { RecorridosHomePage } from "@/modules/recorridos/components/home-page";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

const TABS = ["eventos", "bodegas", "recorridos"] as const;
export default function HomeScreen() {
  const { tab = "eventos" } = useLocalSearchParams<{ tab: string }>();
  const [currentTab, setCurrentTab] = useState(
    () => TABS.indexOf(tab as (typeof TABS)[number]) ?? 0,
  );

  const panGesture = Gesture.Pan().onEnd((event) => {
    if (event.translationX > 50 && currentTab > 0) {
      runOnJS(setCurrentTab)(currentTab - 1);
    } else if (event.translationX < -50 && currentTab < TABS.length - 1) {
      runOnJS(setCurrentTab)(currentTab + 1);
    }
  });

  const RenderContent = useMemo(() => {
    switch (TABS[currentTab]) {
      case "bodegas":
        return BodegaHomePage;
      case "recorridos":
        return RecorridosHomePage;
      case "eventos":
      default:
        return EventoHomePage;
    }
  }, [currentTab]);

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <HomeTopBar
          setCurrentTab={(tab) =>
            setCurrentTab(TABS.indexOf(tab as (typeof TABS)[number]))
          }
          current={TABS[currentTab]}
        />
        <RenderContent />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});

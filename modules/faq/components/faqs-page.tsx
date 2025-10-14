import { Colors } from "@/constants/colors";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getFaqs } from "../api";
import { Faq, FaqListParams, FaqRecipientsEnum } from "../types";

const renderFaqItem = ({ item, index }: { item: Faq; index: number }) => (
  <View style={styles.faqItem}>
    <Text style={styles.question}>
      {index + 1}. {item.question}
    </Text>
    <Text style={styles.answer}>{item.answer}</Text>
  </View>
);

const renderEmpty = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>
      No hay preguntas frecuentes disponibles
    </Text>
  </View>
);

export function FaqsPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => {
      const params: FaqListParams = {
        page: 1,
        limit: 100, // Get all FAQs at once
        orderBy: "created_at:desc",
      };
      return getFaqs(params).then((res) => {
        return {
          items: res.items.filter(
            (faq) => faq.recipient.name === FaqRecipientsEnum.END,
          ),
          meta: res.meta,
        };
      });
    },
  });

  const faqs = data?.items ?? [];

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Cargando preguntas frecuentes...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error al cargar las preguntas frecuentes
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          Volver
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preguntas Frecuentes</Text>
      <FlatList
        data={faqs}
        renderItem={renderFaqItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={[Colors.light.primary]}
            tintColor={Colors.light.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text.primary,
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  faqItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray.secondary,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text.primary,
    marginBottom: 8,
    lineHeight: 22,
  },
  answer: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    textAlign: "center",
  },
});

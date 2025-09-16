import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import React from "react";
import { DimensionValue, StyleSheet, View } from "react-native";

interface SkeletonBoxProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  marginBottom?: number;
  marginTop?: number;
}

const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  marginBottom = 0,
  marginTop = 0,
}) => (
  <View
    style={[
      styles.skeletonBox,
      {
        width,
        height,
        borderRadius,
        marginBottom,
        marginTop,
      },
    ]}
  />
);

export const EventoSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Event name skeleton */}
        <SkeletonBox height={32} marginBottom={Spacing.sm} />

        {/* Image skeleton */}
        <View style={styles.bodegaImageContainer}>
          <SkeletonBox height={200} borderRadius={10} />
        </View>

        {/* Event info skeleton */}
        <View style={styles.eventoInfo}>
          <SkeletonBox width="60%" height={18} marginBottom={Spacing.sm} />
          <SkeletonBox width="40%" height={18} marginBottom={Spacing.sm} />
          <View style={styles.ratingContainer}>
            <SkeletonBox width="50%" height={18} />
            <SkeletonBox width={16} height={16} borderRadius={8} />
          </View>
          <SkeletonBox width="80%" height={18} marginBottom={Spacing.sm} />
          <View style={styles.statusContainer}>
            <SkeletonBox width="20%" height={18} />
            <SkeletonBox width="30%" height={24} borderRadius={12} />
          </View>
        </View>

        {/* Buttons skeleton */}
        <View style={styles.buttonsContainer}>
          <SkeletonBox height={56} borderRadius={12} />
          <SkeletonBox height={56} borderRadius={12} />
        </View>

        {/* Related events skeleton */}
        <SkeletonBox width="70%" height={24} marginBottom={Spacing.md} />
        <View style={styles.relatedContainer}>
          <SkeletonBox width={150} height={120} borderRadius={10} />
          <SkeletonBox width={150} height={120} borderRadius={10} />
          <SkeletonBox width={150} height={120} borderRadius={10} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: Spacing.xl,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  skeletonBox: {
    backgroundColor: Colors.light.gray.primary,
    opacity: 0.6,
  },
  bodegaImageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  eventoInfo: {
    marginBottom: Spacing.sm,
    backgroundColor: Colors.light.gray.primary,
    padding: Spacing.md,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: Spacing.sm,
  },
  ratingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  relatedContainer: {
    display: "flex",
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: 100,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
});

import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Bell } from "lucide-react-native";
import { palette } from "../utils/constants";
import { ToastIconComponent } from "../utils/types";

type NotificationToastProps = {
  text1?: string;
  text2?: string;
  onPress?: () => void;
  props?: {
    text?: string;
    emojiName?: ToastIconComponent;
  };
};

const BellIcon = Bell as unknown as ToastIconComponent;

export const NotificationToast = (props: NotificationToastProps) => {
  const { text1, text2, onPress } = props;
  const { text, emojiName: Icon } = props.props || {};

  const displayTitle = text || text2 || text1;
  const color = palette.info;

  const insets = useSafeAreaInsets();
  const topPadding = insets.top > 0 ? insets.top : hp("2.5%");

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.wrapper,
        styles.notificationWrapper,
        { marginTop: Platform.OS === "ios" ? topPadding : 0 },
      ]}
    >
      <BlurView intensity={40} tint="dark" style={styles.blur} />
      <LinearGradient
        colors={[`${color}80`, palette.shadowWhite]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1.25, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.content}>
        <View style={[styles.shadowIcon, { backgroundColor: `${color}1F` }]}>
          {Icon ? (
            <Icon size={hp("2.5%")} color={palette.white} />
          ) : (
            <BellIcon size={hp("2.5%")} color={color} />
          )}
        </View>
        <Text
          style={[styles.text, { paddingVertical: hp(1) }]}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {displayTitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: wp(4),
    overflow: "hidden",
    backgroundColor: "rgba(20, 20, 20, 1)",
    zIndex: 9999,
  },
  notificationWrapper: {
    width: wp("92%"),
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingVertical: hp("1.2%"),
    paddingHorizontal: wp("3%"),
    alignItems: "center",
    flexDirection: "row",
    gap: wp("3%"),
  },
  text: {
    flex: 1,
    color: palette.white,
    fontSize: hp("1.6%"),
    lineHeight: hp("2.1%"),
    letterSpacing: 0.2,
    textAlign: "left",
  },
  shadowIcon: {
    width: hp("4%"),
    height: hp("4%"),
    borderRadius: hp("1.2%"),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
});

import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react-native";
import { palette } from "../utils/constants";
import { ToastIconComponent, ToastStatus } from "../utils/types";

type CustomToastProps = {
  message: string;
  status?: ToastStatus;
  noMargin?: boolean;
  leftColor?: string;
  rightColor?: string;
  icon?: ToastIconComponent;
  iconColor?: string;
};

const AlertCircleIcon = AlertCircle as unknown as ToastIconComponent;
const CheckCircle2Icon = CheckCircle2 as unknown as ToastIconComponent;
const InfoIcon = Info as unknown as ToastIconComponent;
const XCircleIcon = XCircle as unknown as ToastIconComponent;

const normalizeStatus = (
  status: ToastStatus,
): Exclude<ToastStatus, "error"> | "danger" => {
  if (status === "error") {
    return "danger";
  }
  return status;
};

export const CustomToast = ({
  message,
  status = "success",
  noMargin = false,
  leftColor,
  rightColor,
  icon: CustomIcon,
  iconColor,
}: CustomToastProps) => {
  const safeStatus = normalizeStatus(status);

  const getIconConfig = () => {
    const size = hp("2.5%");
    switch (safeStatus) {
      case "success":
        return {
          color: palette.success,
          icon: <CheckCircle2Icon size={size} color={palette.success} />,
        };
      case "danger":
        return {
          color: palette.danger,
          icon: <XCircleIcon size={size} color={palette.danger} />,
        };
      case "warning":
        return {
          color: palette.warning,
          icon: <AlertCircleIcon size={size} color={palette.warning} />,
        };
      case "custom": {
        const customColor = iconColor ?? palette.info;
        return {
          color: customColor,
          icon: CustomIcon ? (
            <CustomIcon size={size} color={customColor} />
          ) : (
            <InfoIcon size={size} color={customColor} />
          ),
        };
      }
      case "info":
      default:
        return {
          color: palette.info,
          icon: <InfoIcon size={size} color={palette.info} />,
        };
    }
  };

  const { icon, color } = getIconConfig();
  const gradientLeft = leftColor ?? `${color}80`;
  const gradientRight = rightColor ?? palette.toastRight;
  const insets = useSafeAreaInsets();
  const topPadding = noMargin ? 0 : insets.top > 0 ? insets.top : hp("2%");

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: wp("90%"),
          marginLeft: noMargin ? wp("3.9%") : 0,
          marginRight: wp("5%"),
          alignSelf: "center",
          marginTop: Platform.OS === "ios" ? topPadding : 0,
        },
      ]}
    >
      <LinearGradient
        colors={[gradientLeft, gradientRight]}
        start={{ x: 0, y: 0.75 }}
        end={{ x: 1, y: 0.25 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.content}>
        <View style={[styles.shadowIcon, { backgroundColor: `${color}1F` }]}>
          {icon}
        </View>
        <Text style={styles.text} numberOfLines={3} ellipsizeMode="tail">
          {typeof message === "string" ? message : String(message || "")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: wp(4),
    overflow: "hidden",
    backgroundColor: "rgba(20, 20, 20, 1)",
    zIndex: 9999,
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

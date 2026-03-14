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
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react-native";

type ToastIconComponent = React.ComponentType<{
  size?: number | string;
  color?: string;
}>;

const AlertCircleIcon = AlertCircle as unknown as ToastIconComponent;
const BellIcon = Bell as unknown as ToastIconComponent;
const CheckCircle2Icon = CheckCircle2 as unknown as ToastIconComponent;
const InfoIcon = Info as unknown as ToastIconComponent;
const XCircleIcon = XCircle as unknown as ToastIconComponent;

export type BlurToastType = "success" | "error" | "info" | "warning";

export const ALERT_TYPE = {
  SUCCESS: "success" as BlurToastType,
  DANGER: "error" as BlurToastType,
  INFO: "info" as BlurToastType,
  WARNING: "warning" as BlurToastType,
};

export type ToastStatus = BlurToastType;

const palette = {
  success: "#60CF9B",
  error: "#FF4D4F",
  warning: "#FFCC00",
  info: "#169DAF",
  white: "#FFFFFF",
  shadowWhite: "#F7F7F7",
};

type CustomToastProps = {
  message: string;
  status?: ToastStatus;
  noMargin?: boolean;
  leftColor?: string;
  rightColor?: string;
};

export const CustomToast = ({
  message,
  status = "success",
  noMargin = false,
  leftColor,
  rightColor,
}: CustomToastProps) => {
  const getIconConfig = () => {
    const size = hp("2.5%");
    switch (status) {
      case "success":
        return {
          color: palette.success,
          icon: <CheckCircle2Icon size={size} color={palette.success} />,
        };
      case "error":
        return {
          color: palette.error,
          icon: <XCircleIcon size={size} color={palette.error} />,
        };
      case "warning":
        return {
          color: palette.warning,
          icon: <AlertCircleIcon size={size} color={palette.warning} />,
        };
      case "info":
        return {
          color: palette.info,
          icon: <InfoIcon size={size} color={palette.info} />,
        };
      default:
        return {
          color: palette.success,
          icon: <CheckCircle2Icon size={size} color={palette.success} />,
        };
    }
  };

  const { icon, color } = getIconConfig();
  const gradientLeft = leftColor ?? `${color}80`;
  const gradientRight = rightColor ?? palette.shadowWhite;
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

type NotificationIconProps = { size?: number | string; color?: string };
type NotificationToastProps = {
  text1?: string;
  text2?: string;
  onPress?: () => void;
  props?: {
    text?: string;
    emojiName?: React.ComponentType<NotificationIconProps>;
  };
};

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

type ObjectShowArg = {
  type?: BlurToastType | keyof typeof ALERT_TYPE;
  textBody: string;
  duration?: number;
  leftColor?: string;
  rightColor?: string;
};

interface ShowOptions {
  type?: BlurToastType;
  duration?: number;
  leftColor?: string;
  rightColor?: string;
}

export const useBlurToast = () => {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState<BlurToastType>("success");
  const [leftColor, setLeftColor] = React.useState<string | undefined>();
  const [rightColor, setRightColor] = React.useState<string | undefined>();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolveType = (
    t?: BlurToastType | keyof typeof ALERT_TYPE,
  ): BlurToastType => {
    if (!t) {
      return "success";
    }
    if (typeof t === "string" && (t as keyof typeof ALERT_TYPE) in ALERT_TYPE) {
      return ALERT_TYPE[t as keyof typeof ALERT_TYPE];
    }
    return t as BlurToastType;
  };

  const hide = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    opacity.value = withTiming(0, {
      duration: 180,
      easing: Easing.in(Easing.cubic),
    });
    translateY.value = withTiming(
      -20,
      { duration: 180, easing: Easing.in(Easing.cubic) },
      () => {
        runOnJS(setVisible)(false);
      },
    );
  }, [opacity, translateY]);

  const show = React.useCallback(
    (arg: string | ObjectShowArg, opts?: ShowOptions) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (typeof arg === "string") {
        setMessage(arg);
        setType(resolveType(opts?.type));
        setLeftColor(opts?.leftColor);
        setRightColor(opts?.rightColor);
      } else {
        setMessage(arg.textBody);
        setType(resolveType(arg.type));
        setLeftColor(arg.leftColor);
        setRightColor(arg.rightColor);
      }

      setVisible(true);
      opacity.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });

      const auto =
        (typeof arg === "string" ? opts?.duration : arg.duration) ?? 3000;
      if (auto > 0) {
        timerRef.current = setTimeout(() => hide(), auto);
      }
    },
    [hide, opacity, translateY],
  );

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const aStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const Toast = () => {
    if (!visible) {
      return null;
    }

    const insets = useSafeAreaInsets();

    return (
      <Animated.View
        pointerEvents="box-none"
        style={[styles.floatingWrapper, aStyle, { top: insets.top }]}
      >
        <CustomToast
          message={message}
          status={type}
          noMargin
          leftColor={leftColor}
          rightColor={rightColor}
        />
      </Animated.View>
    );
  };

  return { Toast, show, hide };
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
  floatingWrapper: {
    position: "absolute",
    left: wp("5%"),
    right: wp("5%"),
    zIndex: 9999,
    backgroundColor: "transparent",
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

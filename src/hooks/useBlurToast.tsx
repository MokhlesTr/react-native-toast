import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  FadeInDown,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { CustomToast } from "../components/CustomToast";
import { MAX_TOASTS } from "../utils/constants";
import {
  ALERT_TYPE,
  ActiveToast,
  BlurToastType,
  ObjectShowArg,
  ShowOptions,
} from "../utils/types";

const resolveType = (type?: ObjectShowArg["type"]): BlurToastType => {
  if (!type) {
    return "success";
  }

  if (typeof type === "string" && type in ALERT_TYPE) {
    return ALERT_TYPE[type as keyof typeof ALERT_TYPE];
  }

  if (type === "error") {
    return "danger";
  }

  return type as BlurToastType;
};

export const useBlurToast = () => {
  const [toasts, setToasts] = React.useState<ActiveToast[]>([]);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const idRef = React.useRef(0);
  const timersRef = React.useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const removeToast = React.useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const hide = React.useCallback(() => {
    setToasts(prev => {
      if (prev.length === 0) {
        return prev;
      }

      const [oldest] = prev;
      const timer = timersRef.current.get(oldest.id);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(oldest.id);
      }

      return prev.filter(toast => toast.id !== oldest.id);
    });
  }, []);

  React.useEffect(() => {
    if (toasts.length > 0) {
      opacity.value = withTiming(1, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    opacity.value = withTiming(0, {
      duration: 180,
      easing: Easing.in(Easing.cubic),
    });
    translateY.value = withTiming(-16, {
      duration: 180,
      easing: Easing.in(Easing.cubic),
    });
  }, [opacity, toasts.length, translateY]);

  const show = React.useCallback(
    (arg: string | ObjectShowArg, opts?: ShowOptions) => {
      const nextId = ++idRef.current;
      const toast: ActiveToast =
        typeof arg === "string"
          ? {
              id: nextId,
              message: arg,
              type: resolveType(opts?.type),
              leftColor: opts?.leftColor,
              rightColor: opts?.rightColor,
              icon: opts?.icon,
              iconColor: opts?.iconColor,
            }
          : {
              id: nextId,
              message: arg.textBody,
              type: resolveType(arg.type),
              leftColor: arg.leftColor,
              rightColor: arg.rightColor,
              icon: arg.icon,
              iconColor: arg.iconColor,
            };

      setToasts(prev => {
        const next = [...prev, toast];
        if (next.length <= MAX_TOASTS) {
          return next;
        }

        const removed = next[0];
        const removedTimer = timersRef.current.get(removed.id);
        if (removedTimer) {
          clearTimeout(removedTimer);
          timersRef.current.delete(removed.id);
        }

        return next.slice(next.length - MAX_TOASTS);
      });

      const auto =
        (typeof arg === "string" ? opts?.duration : arg.duration) ?? 3000;
      if (auto > 0) {
        const timer = setTimeout(() => removeToast(nextId), auto);
        timersRef.current.set(nextId, timer);
      }
    },
    [removeToast],
  );

  React.useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const aStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const Toast = () => {
    if (toasts.length === 0) {
      return null;
    }

    const insets = useSafeAreaInsets();

    return (
      <Animated.View
        pointerEvents="box-none"
        style={[styles.floatingWrapper, aStyle, { top: insets.top }]}
      >
        {toasts.map(toast => (
          <Animated.View
            key={toast.id}
            entering={FadeInDown.duration(260).easing(Easing.out(Easing.cubic))}
            layout={LinearTransition.duration(180).easing(
              Easing.out(Easing.cubic),
            )}
            style={styles.toastItem}
          >
            <CustomToast
              message={toast.message}
              status={toast.type}
              noMargin
              leftColor={toast.leftColor}
              rightColor={toast.rightColor}
              icon={toast.icon}
              iconColor={toast.iconColor}
            />
          </Animated.View>
        ))}
      </Animated.View>
    );
  };

  return { Toast, show, hide };
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: "absolute",
    left: wp("5%"),
    right: wp("5%"),
    zIndex: 9999,
    backgroundColor: "transparent",
  },
  toastItem: {
    marginBottom: hp("0.6%"),
  },
});

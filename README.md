# react-native-toast

Reusable toast UI primitives for React Native.

<p align="center">
  <img src="https://raw.githubusercontent.com/MokhlesTr/react-native-toast/main/visual_showcase.gif" width="360"/>
</p>

## Version 1.3.0

- Refactored into components, hooks, and utils.
- Built-in queue stack with max 3 toasts.
- New custom toast type.
- Default right color is #545D595E.

## Install

    yarn add @tarmiz/react-native-toast
    yarn add react-native-reanimated react-native-safe-area-context react-native-responsive-screen lucide-react-native expo-blur expo-linear-gradient

## Basic Usage

    import React from "react";
    import { Pressable, Text, View } from "react-native";
    import { ALERT_TYPE, useBlurToast } from "@tarmiz/react-native-toast";

    export const Example = () => {
      const { Toast, show } = useBlurToast();

      return (
        <>
          <View>
            <Pressable
              onPress={() =>
                show({
                  textBody: "Saved successfully",
                  type: ALERT_TYPE.SUCCESS,
                  duration: 3000,
                })
              }
            >
              <Text>Show toast</Text>
            </Pressable>
          </View>

          <Toast />
        </>
      );
    };

## Custom Toast Usage

You can use the new custom option to control icon + left/right colors + text.

    import React from "react";
    import { Pressable, Text } from "react-native";
    import { Rocket } from "lucide-react-native";
    import { ALERT_TYPE, useBlurToast } from "@tarmiz/react-native-toast";

    export const CustomToastExample = () => {
      const { Toast, show } = useBlurToast();

      return (
        <>
          <Pressable
            onPress={() =>
              show({
                textBody: "Deploy started",
                type: ALERT_TYPE.CUSTOM,
                icon: Rocket,
                iconColor: "#7EE787",
                leftColor: "rgba(126, 231, 135, 0.35)",
                rightColor: "rgba(84, 93, 89, 0.37)",
                duration: 3500,
              })
            }
          >
            <Text>Show custom toast</Text>
          </Pressable>

          <Toast />
        </>
      );
    };

## Toast Types

- ALERT_TYPE.SUCCESS
- ALERT_TYPE.INFO
- ALERT_TYPE.DANGER
- ALERT_TYPE.WARNING
- ALERT_TYPE.CUSTOM

Legacy error input is still supported and mapped internally to danger.

## Colors

You can pass any valid color for leftColor and rightColor, including named colors, hex, and rgba.

Default behavior:

- Left color follows toast type color.
- Right color defaults to #545D595E.

## Add Video Demo

If you want a video in README, add this block and replace the URL with your own mp4:

<video src="https://your-domain.com/react-native-toast-demo.mp4" controls muted playsinline width="360"></video>

If your package registry preview does not render video tags, add a fallback link below it:


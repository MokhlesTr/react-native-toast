# react-native-toast

Reusable toast UI primitives.

## Install

```bash
yarn add react-native-reanimated react-native-safe-area-context react-native-responsive-screen lucide-react-native expo-blur expo-linear-gradient
```

## Usage

```tsx
import React from "react";
import { Pressable, Text, View } from "react-native";
import { ALERT_TYPE, useBlurToast } from "react-native-toast";

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
```

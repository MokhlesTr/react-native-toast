import React from "react";

export type ToastIconComponent = React.ComponentType<{
  size?: number | string;
  color?: string;
}>;

export type BlurToastType =
  | "success"
  | "danger"
  | "info"
  | "warning"
  | "custom";

export type LegacyToastType = BlurToastType | "error";

export type ToastStatus = LegacyToastType;

export const ALERT_TYPE = {
  SUCCESS: "success" as BlurToastType,
  DANGER: "danger" as BlurToastType,
  INFO: "info" as BlurToastType,
  WARNING: "warning" as BlurToastType,
  CUSTOM: "custom" as BlurToastType,
};

export type ObjectShowArg = {
  type?: LegacyToastType | keyof typeof ALERT_TYPE;
  textBody: string;
  duration?: number;
  leftColor?: string;
  rightColor?: string;
  icon?: ToastIconComponent;
  iconColor?: string;
};

export interface ShowOptions {
  type?: LegacyToastType;
  duration?: number;
  leftColor?: string;
  rightColor?: string;
  icon?: ToastIconComponent;
  iconColor?: string;
}

export type ActiveToast = {
  id: number;
  message: string;
  type: BlurToastType;
  leftColor?: string;
  rightColor?: string;
  icon?: ToastIconComponent;
  iconColor?: string;
};

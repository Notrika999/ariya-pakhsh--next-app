"use client";

import DatePicker from "react-multi-date-picker";
import type { ComponentProps } from "react";

const DEFAULT_Z_INDEX = 9999;

type AppDatePickerProps = ComponentProps<typeof DatePicker> & {
  zIndex?: number;
};

export default function AppDatePicker({
  portal = true,
  zIndex = DEFAULT_Z_INDEX,
  ...props
}: AppDatePickerProps) {
  return <DatePicker portal={portal} zIndex={zIndex} {...props} />;
}

import { useRef, useState } from "react";
import { Keyboard, StyleSheet, TextInput, View } from "react-native";
import { authColors } from "@/components/auth/AuthChrome";

const otpLength = 5;

export function OtpInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const digits = Array.from({ length: otpLength }, (_, index) => value[index] ?? "");

  const updateDigit = (text: string, index: number) => {
    const clean = text.replace(/\D/g, "");
    const next = [...digits];

    if (clean.length > 1) {
      clean
        .slice(0, otpLength - index)
        .split("")
        .forEach((digit, offset) => {
          next[index + offset] = digit;
        });
      const nextIndex = Math.min(index + clean.length, otpLength - 1);
      onChange(next.join(""));
      inputRefs.current[nextIndex]?.focus();
      if (next.join("").length === otpLength) Keyboard.dismiss();
      return;
    }

    next[index] = clean;
    onChange(next.join(""));

    if (clean && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (clean && index === otpLength - 1) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          value={digit}
          editable={true}
          autoFocus={index === 0}
          keyboardType="number-pad"
          maxLength={1}
          selectionColor={authColors.primary}
          onFocus={() => setFocusedIndex(index)}
          onChangeText={(text) => updateDigit(text, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          style={[
            styles.box,
            focusedIndex === index && styles.boxFocused,
            Boolean(digit) && styles.boxFilled,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 11,
    marginTop: 28,
    marginBottom: 18,
  },
  box: {
    width: 54,
    height: 60,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: authColors.border,
    backgroundColor: authColors.field,
    color: authColors.text,
    textAlign: "center",
    fontSize: 23,
    fontWeight: "900",
    shadowColor: authColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  boxFocused: {
    borderColor: authColors.primary,
    backgroundColor: authColors.field,
  },
  boxFilled: {
    borderColor: authColors.secondary,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  dangerBelow?: number;
  dangerAbove?: number;
  warnBelow?: number;
  warnAbove?: number;
}

export default function GaugeBar({
  label,
  value,
  min = 0,
  max = 100,
  unit = '%',
  dangerBelow,
  dangerAbove,
  warnBelow,
  warnAbove,
}: Props) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const isDanger =
    (dangerBelow !== undefined && value < dangerBelow) ||
    (dangerAbove !== undefined && value > dangerAbove);
  const isWarn =
    !isDanger &&
    ((warnBelow !== undefined && value < warnBelow) ||
      (warnAbove !== undefined && value > warnAbove));

  const barColor = isDanger ? COLORS.danger : isWarn ? COLORS.warning : COLORS.accent;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: barColor }]}>
          {typeof value === 'number' && !Number.isInteger(value)
            ? value.toFixed(1)
            : value}
          {unit}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  track: {
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

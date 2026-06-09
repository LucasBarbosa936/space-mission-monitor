import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { Mission } from '../constants/types';

const STATUS_CONFIG: Record<Mission['status'], { label: string; color: string }> = {
  active:    { label: 'ATIVA',      color: COLORS.accent },
  paused:    { label: 'PAUSADA',    color: COLORS.warning },
  completed: { label: 'CONCLUÍDA',  color: COLORS.primary },
  aborted:   { label: 'ABORTADA',   color: COLORS.danger },
};

export default function StatusBadge({ status }: { status: Mission['status'] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { borderColor: cfg.color }]}>
      <View style={[styles.dot, { backgroundColor: cfg.color }]} />
      <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  label: {
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
});

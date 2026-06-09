import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { Alert } from '../constants/types';

interface Props {
  alert: Alert;
  onAcknowledge: (id: string) => void;
}

export default function AlertCard({ alert, onAcknowledge }: Props) {
  const borderColor =
    alert.type === 'critical'
      ? COLORS.danger
      : alert.type === 'warning'
      ? COLORS.warning
      : COLORS.primary;

  const date = new Date(alert.timestamp);
  const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <View style={[styles.card, { borderLeftColor: borderColor }, alert.acknowledged && styles.acked]}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={[styles.type, { color: borderColor }]}>
            {alert.type.toUpperCase()}
          </Text>
          <Text style={styles.message}>{alert.message}</Text>
          <Text style={styles.time}>{timeStr}</Text>
        </View>
        {!alert.acknowledged && (
          <TouchableOpacity style={styles.ackBtn} onPress={() => onAcknowledge(alert.id)}>
            <Text style={styles.ackText}>OK</Text>
          </TouchableOpacity>
        )}
        {alert.acknowledged && (
          <Text style={styles.ackLabel}>✓ ACK</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 3,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  acked: {
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  type: {
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: 3,
  },
  message: {
    color: COLORS.text,
    fontSize: 13,
    marginBottom: 4,
  },
  time: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  ackBtn: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 4,
    marginLeft: 10,
  },
  ackText: {
    color: COLORS.text,
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  ackLabel: {
    color: COLORS.accent,
    fontSize: 11,
    fontFamily: 'monospace',
    marginLeft: 10,
  },
});

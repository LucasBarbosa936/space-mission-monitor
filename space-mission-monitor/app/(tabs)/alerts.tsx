import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMission } from '../../context/MissionContext';
import { COLORS } from '../../constants/colors';
import AlertCard from '../../components/AlertCard';

export default function AlertsScreen() {
  const { state, acknowledgeAlert, clearAlerts } = useMission();

  const unacked = state.alerts.filter(a => !a.acknowledged);
  const acked = state.alerts.filter(a => a.acknowledged);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>🚨 ALERTAS</Text>
        {state.alerts.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearAlerts}>
            <Text style={styles.clearText}>LIMPAR TODOS</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {state.alerts.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyText}>Nenhum alerta ativo</Text>
            <Text style={styles.emptySubText}>Todos os sistemas operando normalmente</Text>
          </View>
        )}

        {unacked.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>NÃO CONFIRMADOS ({unacked.length})</Text>
            {unacked.map(alert => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} />
            ))}
          </>
        )}

        {acked.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: COLORS.textMuted, marginTop: 14 }]}>
              CONFIRMADOS ({acked.length})
            </Text>
            {acked.map(alert => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  clearBtn: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  clearText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },

  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: 10,
  },

  empty: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  emptySubText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

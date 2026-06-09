import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMission } from '../../context/MissionContext';
import { COLORS } from '../../constants/colors';
import StatusBadge from '../../components/StatusBadge';
import { Mission } from '../../constants/types';

export default function MissionsScreen() {
  const { state, deleteMission, setCurrentMission } = useMission();
  const router = useRouter();

  const handleDelete = (mission: Mission) => {
    Alert.alert(
      'Excluir Missão',
      `Deseja excluir a missão "${mission.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteMission(mission.id),
        },
      ]
    );
  };

  const handleSetActive = (id: string) => {
    setCurrentMission(id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>🚀 MISSÕES</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/mission-form')}
        >
          <Text style={styles.addText}>+ NOVA</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {state.missions.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🛸</Text>
            <Text style={styles.emptyText}>Nenhuma missão cadastrada</Text>
          </View>
        )}

        {state.missions.map(mission => {
          const isCurrent = mission.id === state.currentMissionId;
          return (
            <View
              key={mission.id}
              style={[styles.card, isCurrent && styles.cardActive]}
            >
              {isCurrent && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>● MISSÃO ATIVA</Text>
                </View>
              )}

              <View style={styles.cardHeader}>
                <Text style={styles.missionName}>{mission.name}</Text>
                <StatusBadge status={mission.status} />
              </View>

              <View style={styles.details}>
                <Text style={styles.detail}>🌍 {mission.destination}</Text>
                <Text style={styles.detail}>📅 Lançamento: {mission.launchDate}</Text>
                <Text style={styles.detail}>👨‍🚀 {mission.crew} tripulantes</Text>
                {mission.notes ? (
                  <Text style={styles.notes}>{mission.notes}</Text>
                ) : null}
              </View>

              <View style={styles.actions}>
                {!isCurrent && (
                  <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={() => handleSetActive(mission.id)}
                  >
                    <Text style={styles.btnPrimaryText}>DEFINIR ATIVA</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.btnSecondary}
                  onPress={() => router.push({ pathname: '/mission-form', params: { id: mission.id } })}
                >
                  <Text style={styles.btnSecondaryText}>EDITAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnDanger}
                  onPress={() => handleDelete(mission)}
                >
                  <Text style={styles.btnDangerText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
  addBtn: {
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 4,
  },
  addText: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },

  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: COLORS.textMuted, fontSize: 14, fontFamily: 'monospace' },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardActive: {
    borderColor: COLORS.accent,
    borderWidth: 1.5,
  },
  activeBadge: {
    marginBottom: 8,
  },
  activeBadgeText: {
    color: COLORS.accent,
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  missionName: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 2,
    flex: 1,
    marginRight: 10,
  },
  details: { marginBottom: 12 },
  detail: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  notes: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
    borderLeftWidth: 2,
    borderLeftColor: COLORS.border,
    paddingLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: COLORS.accentDark,
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: COLORS.accent,
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  btnSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  btnDanger: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.dangerDark,
    borderRadius: 4,
    alignItems: 'center',
  },
  btnDangerText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

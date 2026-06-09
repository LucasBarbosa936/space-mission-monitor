import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMission } from '../../context/MissionContext';
import { COLORS } from '../../constants/colors';
import GaugeBar from '../../components/GaugeBar';
import SectionHeader from '../../components/SectionHeader';
import StatusBadge from '../../components/StatusBadge';

function Blink({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.blink, { backgroundColor: color, opacity: anim }]} />;
}

export default function DashboardScreen() {
  const { state, currentMission } = useMission();
  const { sensors } = state;

  const unacked = state.alerts.filter(a => !a.acknowledged).length;
  const hasCritical = state.alerts.some(a => a.type === 'critical' && !a.acknowledged);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('pt-BR');
  const dateStr = now.toLocaleDateString('pt-BR');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>MISSION CTRL</Text>
            <Text style={styles.subtitle}>CENTRO DE CONTROLE ESPACIAL</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.time}>{timeStr}</Text>
            <Text style={styles.date}>{dateStr}</Text>
          </View>
        </View>

        {/* Alert Banner */}
        {unacked > 0 && (
          <View style={[styles.banner, { borderColor: hasCritical ? COLORS.danger : COLORS.warning }]}>
            <Blink color={hasCritical ? COLORS.danger : COLORS.warning} />
            <Text style={[styles.bannerText, { color: hasCritical ? COLORS.danger : COLORS.warning }]}>
              {hasCritical ? '⚠️ ALERTA CRÍTICO' : '⚠️ ATENÇÃO'} — {unacked} alerta{unacked !== 1 ? 's' : ''} ativo{unacked !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* Current Mission */}
        {currentMission && (
          <View style={styles.card}>
            <SectionHeader title="Missão Atual" />
            <View style={styles.missionRow}>
              <View style={styles.missionInfo}>
                <Text style={styles.missionName}>{currentMission.name}</Text>
                <Text style={styles.missionDest}>🌍 {currentMission.destination}</Text>
                <Text style={styles.missionCrew}>👨‍🚀 {currentMission.crew} tripulantes</Text>
              </View>
              <StatusBadge status={currentMission.status} />
            </View>
          </View>
        )}

        {/* Sensors */}
        <View style={styles.card}>
          <SectionHeader title="Telemetria — Energia & Sistemas" />
          <GaugeBar
            label="Energia"
            value={sensors.energy}
            unit="%"
            dangerBelow={20}
            warnBelow={40}
          />
          <GaugeBar
            label="Comunicação"
            value={sensors.communication}
            unit="%"
            dangerBelow={30}
            warnBelow={50}
          />
          <GaugeBar
            label="Estabilidade Orbital"
            value={sensors.orbital}
            unit="%"
            dangerBelow={55}
            warnBelow={70}
          />
          <GaugeBar
            label="Oxigênio"
            value={sensors.oxygen}
            unit="%"
            dangerBelow={25}
            warnBelow={40}
          />
        </View>

        <View style={styles.card}>
          <SectionHeader title="Telemetria — Ambiente" />
          <GaugeBar
            label="Temperatura"
            value={sensors.temperature}
            min={-100}
            max={100}
            unit="°C"
            dangerAbove={90}
            dangerBelow={-90}
            warnAbove={70}
            warnBelow={-70}
          />
          <GaugeBar
            label="Radiação"
            value={sensors.radiation}
            min={0}
            max={1000}
            unit=" mSv"
            dangerAbove={750}
            warnAbove={500}
          />
        </View>

        {/* Status Grid */}
        <View style={styles.card}>
          <SectionHeader title="Status Geral" />
          <View style={styles.grid}>
            {[
              { label: 'ENERGIA',   ok: sensors.energy >= 40,        val: `${sensors.energy.toFixed(0)}%` },
              { label: 'COMM',      ok: sensors.communication >= 50,  val: `${sensors.communication.toFixed(0)}%` },
              { label: 'ÓRBITA',    ok: sensors.orbital >= 70,        val: `${sensors.orbital.toFixed(0)}%` },
              { label: 'O₂',        ok: sensors.oxygen >= 40,         val: `${sensors.oxygen.toFixed(0)}%` },
              { label: 'TEMP',      ok: Math.abs(sensors.temperature) <= 70, val: `${sensors.temperature.toFixed(0)}°C` },
              { label: 'RAD',       ok: sensors.radiation <= 500,     val: `${sensors.radiation.toFixed(0)}` },
            ].map(item => (
              <View
                key={item.label}
                style={[styles.gridItem, { borderColor: item.ok ? COLORS.accent : COLORS.danger }]}
              >
                <Text style={[styles.gridStatus, { color: item.ok ? COLORS.accent : COLORS.danger }]}>
                  {item.ok ? '▲ OK' : '▼ NOK'}
                </Text>
                <Text style={styles.gridVal}>{item.val}</Text>
                <Text style={styles.gridLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ÚLTIMA ATUALIZAÇÃO: {new Date(state.lastUpdated).toLocaleTimeString('pt-BR')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {},
  headerRight: { alignItems: 'flex-end' },
  title: {
    color: COLORS.primary,
    fontSize: 22,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginTop: 2,
  },
  time: {
    color: COLORS.accent,
    fontSize: 16,
    fontFamily: 'monospace',
  },
  date: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: COLORS.surface,
  },
  blink: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  bannerText: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  missionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  missionInfo: { flex: 1 },
  missionName: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 4,
  },
  missionDest: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  missionCrew: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '30%',
    flex: 1,
    minWidth: 90,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  gridStatus: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  gridVal: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  gridLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginTop: 2,
  },

  footer: {
    alignItems: 'center',
    marginTop: 4,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
});

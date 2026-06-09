import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMission } from '../../context/MissionContext';
import { COLORS } from '../../constants/colors';
import { SensorData } from '../../constants/types';
import SectionHeader from '../../components/SectionHeader';

type FormErrors = Partial<Record<keyof SensorData, string>>;

export default function SettingsScreen() {
  const { state, updateSensors, addAlert } = useMission();
  const s = state.sensors;

  const [form, setForm] = useState({
    energy: String(s.energy),
    communication: String(s.communication),
    orbital: String(s.orbital),
    temperature: String(s.temperature),
    radiation: String(s.radiation),
    oxygen: String(s.oxygen),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const pct = (key: keyof SensorData, label: string) => {
      const v = parseFloat(form[key]);
      if (isNaN(v) || v < 0 || v > 100)
        newErrors[key] = `${label}: valor entre 0 e 100`;
    };

    pct('energy', 'Energia');
    pct('communication', 'Comunicação');
    pct('orbital', 'Órbita');
    pct('oxygen', 'Oxigênio');

    const temp = parseFloat(form.temperature);
    if (isNaN(temp) || temp < -200 || temp > 200)
      newErrors.temperature = 'Temperatura: entre -200 e 200°C';

    const rad = parseFloat(form.radiation);
    if (isNaN(rad) || rad < 0 || rad > 2000)
      newErrors.radiation = 'Radiação: entre 0 e 2000 mSv';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const updated: SensorData = {
      energy: parseFloat(form.energy),
      communication: parseFloat(form.communication),
      orbital: parseFloat(form.orbital),
      temperature: parseFloat(form.temperature),
      radiation: parseFloat(form.radiation),
      oxygen: parseFloat(form.oxygen),
    };
    updateSensors(updated);
    addAlert('info', '⚙️ Sensores atualizados manualmente');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = async () => {
    await AsyncStorage.removeItem('@space_mission_state');
    addAlert('info', '🔄 Estado local limpo. Reinicie o app.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ CONFIGURAÇÕES</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Manual sensor update form */}
        <View style={styles.card}>
          <SectionHeader title="Atualizar Sensores Manualmente" />

          {(
            [
              { key: 'energy' as const,        label: 'Energia (%)',          placeholder: '0–100' },
              { key: 'communication' as const,  label: 'Comunicação (%)',      placeholder: '0–100' },
              { key: 'orbital' as const,        label: 'Estab. Orbital (%)',   placeholder: '0–100' },
              { key: 'oxygen' as const,         label: 'Oxigênio (%)',         placeholder: '0–100' },
              { key: 'temperature' as const,    label: 'Temperatura (°C)',     placeholder: '-200 a 200' },
              { key: 'radiation' as const,      label: 'Radiação (mSv)',       placeholder: '0–2000' },
            ] as const
          ).map(field => (
            <View key={field.key} style={styles.field}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={[styles.input, errors[field.key] && styles.inputError]}
                value={form[field.key]}
                onChangeText={val => {
                  setForm(f => ({ ...f, [field.key]: val }));
                  if (errors[field.key]) setErrors(e => ({ ...e, [field.key]: undefined }));
                }}
                keyboardType="numeric"
                placeholder={field.placeholder}
                placeholderTextColor={COLORS.textMuted}
              />
              {errors[field.key] && (
                <Text style={styles.errorText}>{errors[field.key]}</Text>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>
              {saved ? '✓ SALVO COM SUCESSO!' : 'APLICAR VALORES'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* System info */}
        <View style={styles.card}>
          <SectionHeader title="Informações do Sistema" />
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>MISSÕES CADASTRADAS</Text>
            <Text style={styles.infoVal}>{state.missions.length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>ALERTAS ATIVOS</Text>
            <Text style={styles.infoVal}>{state.alerts.filter(a => !a.acknowledged).length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>ÚLTIMA ATUALIZAÇÃO</Text>
            <Text style={styles.infoVal}>
              {new Date(state.lastUpdated).toLocaleTimeString('pt-BR')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>PERSISTÊNCIA</Text>
            <Text style={[styles.infoVal, { color: COLORS.accent }]}>AsyncStorage ✓</Text>
          </View>
        </View>

        {/* Danger zone */}
        <View style={[styles.card, styles.dangerCard]}>
          <SectionHeader title="⚠️ Zona de Perigo" />
          <Text style={styles.dangerDesc}>
            Limpa todos os dados salvos localmente. O app voltará ao estado inicial.
          </Text>
          <TouchableOpacity style={styles.dangerBtn} onPress={handleReset}>
            <Text style={styles.dangerBtnText}>LIMPAR DADOS LOCAIS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
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
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dangerCard: {
    borderColor: COLORS.dangerDark,
  },

  field: { marginBottom: 12 },
  label: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 3,
  },

  saveBtn: {
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  saveBtnText: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoKey: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  infoVal: {
    color: COLORS.text,
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },

  dangerDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 12,
  },
  dangerBtn: {
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dangerBtnText: {
    color: COLORS.danger,
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMission } from '../context/MissionContext';
import { COLORS } from '../constants/colors';
import { Mission } from '../constants/types';

type Status = Mission['status'];

const STATUSES: { value: Status; label: string }[] = [
  { value: 'active',    label: '● ATIVA' },
  { value: 'paused',    label: '⏸ PAUSADA' },
  { value: 'completed', label: '✓ CONCLUÍDA' },
  { value: 'aborted',   label: '✕ ABORTADA' },
];

interface FormState {
  name: string;
  destination: string;
  launchDate: string;
  status: Status;
  crew: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  destination?: string;
  launchDate?: string;
  crew?: string;
}

export default function MissionFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { state, addMission, updateMission } = useMission();

  const existing = id ? state.missions.find(m => m.id === id) : null;
  const isEdit = !!existing;

  const [form, setForm] = useState<FormState>({
    name: existing?.name ?? '',
    destination: existing?.destination ?? '',
    launchDate: existing?.launchDate ?? '',
    status: existing?.status ?? 'active',
    crew: existing ? String(existing.crew) : '',
    notes: existing?.notes ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const set = (key: keyof FormState, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    if (key in errors) setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.name.trim()) e.name = 'Nome da missão é obrigatório';
    else if (form.name.trim().length < 3) e.name = 'Mínimo 3 caracteres';

    if (!form.destination.trim()) e.destination = 'Destino é obrigatório';

    if (!form.launchDate.trim()) {
      e.launchDate = 'Data de lançamento é obrigatória';
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(form.launchDate)) {
        e.launchDate = 'Formato: AAAA-MM-DD';
      }
    }

    const crewNum = parseInt(form.crew, 10);
    if (!form.crew.trim()) e.crew = 'Número de tripulantes é obrigatório';
    else if (isNaN(crewNum) || crewNum < 1 || crewNum > 20)
      e.crew = 'Tripulantes: entre 1 e 20';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data = {
      name: form.name.trim().toUpperCase(),
      destination: form.destination.trim(),
      launchDate: form.launchDate.trim(),
      status: form.status,
      crew: parseInt(form.crew, 10),
      notes: form.notes.trim(),
    };

    if (isEdit && existing) {
      updateMission({ ...data, id: existing.id });
    } else {
      addMission(data);
    }

    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← VOLTAR</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{isEdit ? 'EDITAR MISSÃO' : 'NOVA MISSÃO'}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {/* Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Nome da Missão *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={form.name}
              onChangeText={v => set('name', v)}
              placeholder="Ex: ARTEMIS VII"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="characters"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Destination */}
          <View style={styles.field}>
            <Text style={styles.label}>Destino *</Text>
            <TextInput
              style={[styles.input, errors.destination && styles.inputError]}
              value={form.destination}
              onChangeText={v => set('destination', v)}
              placeholder="Ex: Marte - Valles Marineris"
              placeholderTextColor={COLORS.textMuted}
            />
            {errors.destination && <Text style={styles.errorText}>{errors.destination}</Text>}
          </View>

          {/* Launch Date */}
          <View style={styles.field}>
            <Text style={styles.label}>Data de Lançamento * (AAAA-MM-DD)</Text>
            <TextInput
              style={[styles.input, errors.launchDate && styles.inputError]}
              value={form.launchDate}
              onChangeText={v => set('launchDate', v)}
              placeholder="2026-07-20"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numbers-and-punctuation"
              maxLength={10}
            />
            {errors.launchDate && <Text style={styles.errorText}>{errors.launchDate}</Text>}
          </View>

          {/* Crew */}
          <View style={styles.field}>
            <Text style={styles.label}>Número de Tripulantes *</Text>
            <TextInput
              style={[styles.input, errors.crew && styles.inputError]}
              value={form.crew}
              onChangeText={v => set('crew', v)}
              placeholder="1–20"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              maxLength={2}
            />
            {errors.crew && <Text style={styles.errorText}>{errors.crew}</Text>}
          </View>

          {/* Status */}
          <View style={styles.field}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusGrid}>
              {STATUSES.map(s => (
                <TouchableOpacity
                  key={s.value}
                  style={[
                    styles.statusBtn,
                    form.status === s.value && styles.statusBtnActive,
                  ]}
                  onPress={() => set('status', s.value)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      form.status === s.value && styles.statusTextActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.field}>
            <Text style={styles.label}>Observações (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.notes}
              onChangeText={v => set('notes', v)}
              placeholder="Notas sobre a missão..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>
              {isEdit ? '✓ SALVAR ALTERAÇÕES' : '🚀 CRIAR MISSÃO'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 14,
  },
  backBtn: {
    paddingVertical: 4,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  field: { marginBottom: 16 },
  label: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: COLORS.text,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  textArea: {
    height: 90,
    paddingTop: 11,
  },
  inputError: { borderColor: COLORS.danger },
  errorText: {
    color: COLORS.danger,
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
  },

  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceLight,
  },
  statusBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryDark,
  },
  statusText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  statusTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  submitBtn: {
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

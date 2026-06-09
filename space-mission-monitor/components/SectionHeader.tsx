import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginHorizontal: 10,
    textTransform: 'uppercase',
  },
});

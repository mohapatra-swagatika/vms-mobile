import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useAuth} from '../auth/AuthContext';
import {
  Button,
  Icon,
  ScreenBackground,
  ScreenHeader,
  VisitorCard,
} from '../components';
import {strings} from '../constants';
import {
  checkInVisitor,
  checkOutVisitor,
  listVisitors,
} from '../services/visitorService';
import {colors, radius, shadows, spacing, typography} from '../theme';
import {Visitor, VisitorStatus} from '../types/visitor';

type Props = {
  onBack: () => void;
};

type FilterKey = 'all' | VisitorStatus;

const FILTERS: {key: FilterKey; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'pending', label: 'Pending'},
  {key: 'approved', label: 'Approved'},
  {key: 'checked_in', label: 'Checked in'},
  {key: 'checked_out', label: 'Checked out'},
];

export function VisitorsListScreen({onBack}: Props) {
  const {state, canCheckInVisitor, canCheckOutVisitor} = useAuth();
  const insets = useSafeAreaInsets();

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [actionId, setActionId] = useState<string | null>(null);

  const loadVisitors = useCallback(
    async (isRefresh = false) => {
      if (!state.accessToken) {
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await listVisitors(state.accessToken, {search});
        setVisitors(result.visitors);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : strings.visitors.loadFailed,
        );
        setVisitors([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, state.accessToken],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadVisitors();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadVisitors]);

  const filteredVisitors = useMemo(() => {
    if (filter === 'all') {
      return visitors;
    }
    return visitors.filter(visitor => visitor.status === filter);
  }, [filter, visitors]);

  const stats = useMemo(() => {
    return {
      total: visitors.length,
      checkedIn: visitors.filter(v => v.status === 'checked_in').length,
      pending: visitors.filter(v => v.status === 'pending').length,
    };
  }, [visitors]);

  const onCheckIn = async (visitorId: string) => {
    if (!state.accessToken) {
      return;
    }
    setActionId(visitorId);
    try {
      const updated = await checkInVisitor(state.accessToken, visitorId);
      setVisitors(current =>
        current.map(item => (item.id === visitorId ? updated : item)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : strings.visitors.loadFailed);
    } finally {
      setActionId(null);
    }
  };

  const onCheckOut = async (visitorId: string) => {
    if (!state.accessToken) {
      return;
    }
    setActionId(visitorId);
    try {
      const updated = await checkOutVisitor(state.accessToken, visitorId);
      setVisitors(current =>
        current.map(item => (item.id === visitorId ? updated : item)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : strings.visitors.loadFailed);
    } finally {
      setActionId(null);
    }
  };

  const renderItem = ({item}: {item: Visitor}) => {
    const busy = actionId === item.id;
    const showCheckIn =
      canCheckInVisitor &&
      item.status !== 'checked_in' &&
      item.status !== 'checked_out';
    const showCheckOut =
      canCheckOutVisitor &&
      (item.status === 'checked_in' || item.status === 'approved');

    return (
      <VisitorCard
        visitor={item}
        busy={busy}
        showCheckIn={showCheckIn}
        showCheckOut={showCheckOut}
        onCheckIn={() => onCheckIn(item.id)}
        onCheckOut={() => onCheckOut(item.id)}
      />
    );
  };

  return (
    <ScreenBackground>
      <View
        style={[
          styles.root,
          {paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom},
        ]}
      >
        <ScreenHeader
          title={strings.visitors.title}
          subtitle={strings.visitors.subtitle}
          onBack={onBack}
          backLabel={strings.visitors.back}
        />

        <View style={styles.statsRow}>
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Checked in" value={stats.checkedIn} accent={colors.primaryLight} />
          <StatCard label="Pending" value={stats.pending} accent={colors.warning} />
        </View>

        <View style={[styles.searchWrap, shadows.sm]}>
          <Icon name="search" size={18} color={colors.textTertiary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={strings.visitors.searchPlaceholder}
            placeholderTextColor={colors.textTertiary}
            style={styles.search}
          />
        </View>

        <View style={styles.filters}>
          {FILTERS.map(item => (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[
                styles.filterChip,
                filter === item.key && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item.key && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.primaryLight} size="large" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.error}>{error}</Text>
            <Button label="Retry" onPress={() => loadVisitors()} />
          </View>
        ) : (
          <FlatList
            data={filteredVisitors}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadVisitors(true)}
                tintColor={colors.primaryLight}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyTitle}>No visitors found</Text>
                <Text style={styles.empty}>{strings.visitors.empty}</Text>
              </View>
            }
          />
        )}
      </View>
    </ScreenBackground>
  );
}

function StatCard({
  label,
  value,
  accent = colors.textPrimary,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, {color: accent}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    ...typography.headline,
    fontSize: 22,
  },
  statLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    marginBottom: spacing.md,
  },
  search: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    paddingVertical: 0,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.borderFocus,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.primaryLight,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: spacing.lg,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: spacing.xl * 2,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});

import { useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertOctagon,
  Clock,
  PackageMinus,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import type { Medicine } from '../../types';
import { useInventory } from '../inventory/useInventory';
import {
  getExpired,
  getExpiringSoon,
  getLowStock,
} from './alertUtils';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { cn } from '../../lib/cn';
import { daysUntil, formatDate } from '../../lib/date';

type Tone = 'expired' | 'expiring-soon' | 'low-stock';

interface AlertSectionProps {
  tone: Tone;
  icon: LucideIcon;
  title: string;
  description: string;
  medicines: Medicine[];
  renderMeta: (medicine: Medicine) => ReactNode;
  emptyText: string;
}

const TONE_STYLES: Record<
  Tone,
  { iconWrap: string; count: string; badge: 'expired' | 'expiring-soon' | 'low-stock' }
> = {
  expired: {
    iconWrap: 'bg-red-50 text-red-600',
    count: 'text-red-600',
    badge: 'expired',
  },
  'expiring-soon': {
    iconWrap: 'bg-orange-50 text-orange-600',
    count: 'text-orange-600',
    badge: 'expiring-soon',
  },
  'low-stock': {
    iconWrap: 'bg-amber-50 text-amber-700',
    count: 'text-amber-700',
    badge: 'low-stock',
  },
};

function AlertSection({
  tone,
  icon: Icon,
  title,
  description,
  medicines,
  renderMeta,
  emptyText,
}: AlertSectionProps) {
  const styles = TONE_STYLES[tone];

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <header className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg',
              styles.iconWrap,
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
            <p className="text-xs text-zinc-500">{description}</p>
          </div>
        </div>
        <span className={cn('text-2xl font-semibold tracking-tight', styles.count)}>
          {medicines.length}
        </span>
      </header>

      {medicines.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
            title="All clear"
            description={emptyText}
          />
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {medicines.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-4 px-5 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {m.name}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {m.supplier} &middot; {m.category}
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-3">
                {renderMeta(m)}
                <Badge variant={styles.badge}>
                  {tone === 'expired'
                    ? 'Expired'
                    : tone === 'expiring-soon'
                      ? 'Expiring'
                      : 'Low stock'}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function AlertsPage() {
  const { medicines } = useInventory();

  const { expired, expiringSoon, lowStock } = useMemo(
    () => ({
      expired: getExpired(medicines),
      expiringSoon: getExpiringSoon(medicines),
      lowStock: getLowStock(medicines),
    }),
    [medicines],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Alerts
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Items needing attention. Manage them from the{' '}
          <Link
            to="/inventory"
            className="font-medium text-zinc-900 underline underline-offset-2"
          >
            Inventory
          </Link>{' '}
          page.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AlertSection
          tone="expired"
          icon={AlertOctagon}
          title="Expired"
          description="Past their expiry date."
          medicines={expired}
          emptyText="No medicines have expired."
          renderMeta={(m) => (
            <div className="text-right">
              <p className="text-xs font-medium text-zinc-700">
                {formatDate(m.expiryDate)}
              </p>
              <p className="text-xs text-zinc-500">
                {Math.abs(daysUntil(m.expiryDate))}d ago
              </p>
            </div>
          )}
        />
        <AlertSection
          tone="expiring-soon"
          icon={Clock}
          title="Expiring soon"
          description="Within the next 30 days."
          medicines={expiringSoon}
          emptyText="Nothing is expiring in the next 30 days."
          renderMeta={(m) => (
            <div className="text-right">
              <p className="text-xs font-medium text-zinc-700">
                {formatDate(m.expiryDate)}
              </p>
              <p className="text-xs text-zinc-500">
                in {daysUntil(m.expiryDate)}d
              </p>
            </div>
          )}
        />
        <AlertSection
          tone="low-stock"
          icon={PackageMinus}
          title="Low stock"
          description="Below their minimum threshold."
          medicines={lowStock}
          emptyText="All medicines are above their thresholds."
          renderMeta={(m) => (
            <div className="text-right">
              <p className="text-xs font-medium text-zinc-700">
                {m.quantity} / {m.minQuantityThreshold}
              </p>
              <p className="text-xs text-zinc-500">qty / min</p>
            </div>
          )}
        />
      </div>
    </div>
  );
}

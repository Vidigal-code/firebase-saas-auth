import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FEATURES } from '@/shared/config/features';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ScheduledDispatchNotice } from './ScheduledDispatchNotice';

vi.mock('@/shared/config/features', () => ({ FEATURES: { scheduledDispatch: false } }));

describe('ScheduledDispatchNotice', () => {
  it('warns that scheduled messages are not dispatched while the Cloud Function is disabled', () => {
    renderWithProviders(<ScheduledDispatchNotice />);

    expect(screen.getByRole('alert')).toHaveTextContent('Disparo automático inativo');
  });

  it('renders nothing once the scheduled dispatch is enabled', () => {
    vi.mocked(FEATURES).scheduledDispatch = true;

    renderWithProviders(<ScheduledDispatchNotice />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

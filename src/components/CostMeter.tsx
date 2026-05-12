import { useState, useEffect, useRef, useCallback } from 'react';
import {
  makeStyles,
  tokens,
  Body1,
  Body1Strong,
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  Badge,
} from '@fluentui/react-components';
import {
  PeopleTeamRegular,
  MoneyRegular,
  PlayRegular,
  PauseRegular,
  ArrowResetRegular,
  ClockRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalM,
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  costDisplay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXL,
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: tokens.borderRadiusXLarge,
    color: tokens.colorNeutralForegroundOnBrand,
    gap: tokens.spacingVerticalS,
  },
  costAmount: {
    fontSize: '3rem',
    fontWeight: tokens.fontWeightBold,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  timerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    opacity: 0.85,
  },
  inputRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  controlRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  statsCard: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalXS,
  },
  runningBadge: {
    animation: 'pulse 2s infinite',
  },
});

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatCost(eur: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(eur);
}

function parseSafeInt(value: string, fallback: number): number {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function parseSafeFloat(value: string, fallback: number): number {
  const n = parseFloat(value.replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

const STORAGE_KEY_RATE = 'mcapp_hourly_rate';
const DEFAULT_RATE = 100;

export function CostMeter() {
  const styles = useStyles();

  const savedRate = parseFloat(localStorage.getItem(STORAGE_KEY_RATE) ?? String(DEFAULT_RATE));

  const [participants, setParticipants] = useState(4);
  const [hourlyRate, setHourlyRate] = useState(Number.isFinite(savedRate) ? savedRate : DEFAULT_RATE);
  const [participantsInput, setParticipantsInput] = useState(String(4));
  const [rateInput, setRateInput] = useState(String(Number.isFinite(savedRate) ? savedRate : DEFAULT_RATE));

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cost = (participants * hourlyRate * elapsedSeconds) / 3600;

  const start = useCallback(() => {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
  }, [running]);

  const pause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setElapsedSeconds(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const handleParticipantsChange = (value: string) => {
    setParticipantsInput(value);
    const n = parseSafeInt(value, participants);
    setParticipants(n);
  };

  const handleRateChange = (value: string) => {
    setRateInput(value);
    const n = parseSafeFloat(value, hourlyRate);
    setHourlyRate(n);
    localStorage.setItem(STORAGE_KEY_RATE, String(n));
  };

  const costPerMinute = (participants * hourlyRate) / 60;

  return (
    <div className={styles.root}>
      {/* Kostenausgabe */}
      <div className={styles.costDisplay}>
        <Body1Strong style={{ color: 'inherit', opacity: 0.85 }}>
          Aktuelle Meeting-Kosten
        </Body1Strong>
        <div className={styles.costAmount}>{formatCost(cost)}</div>
        <div className={styles.timerRow}>
          <ClockRegular />
          <Body1 style={{ color: 'inherit' }}>{formatTime(elapsedSeconds)}</Body1>
          {running && (
            <Badge appearance="filled" color="warning" size="small">
              LÄUFT
            </Badge>
          )}
        </div>
      </div>

      {/* Steuerung */}
      <div className={styles.controlRow}>
        {!running ? (
          <Button
            appearance="primary"
            icon={<PlayRegular />}
            onClick={start}
            style={{ flex: 1 }}
          >
            {elapsedSeconds === 0 ? 'Start' : 'Weiter'}
          </Button>
        ) : (
          <Button
            appearance="secondary"
            icon={<PauseRegular />}
            onClick={pause}
            style={{ flex: 1 }}
          >
            Pause
          </Button>
        )}
        <Button
          appearance="subtle"
          icon={<ArrowResetRegular />}
          onClick={reset}
          disabled={elapsedSeconds === 0 && !running}
        >
          Reset
        </Button>
      </div>

      {/* Eingaben */}
      <Card>
        <CardHeader
          header={<Body1Strong>Konfiguration</Body1Strong>}
        />
        <div className={styles.inputRow}>
          <Label htmlFor="participants" required>
            <PeopleTeamRegular style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Teilnehmer
          </Label>
          <Input
            id="participants"
            type="number"
            min={1}
            max={999}
            value={participantsInput}
            onChange={(_, d) => handleParticipantsChange(d.value)}
            contentAfter={<Body1>Personen</Body1>}
          />
        </div>
        <div className={styles.inputRow} style={{ marginTop: 8 }}>
          <Label htmlFor="rate" required>
            <MoneyRegular style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Stundensatz (pro Person)
          </Label>
          <Input
            id="rate"
            type="number"
            min={0}
            step={10}
            value={rateInput}
            onChange={(_, d) => handleRateChange(d.value)}
            contentAfter={<Body1>€/h</Body1>}
          />
        </div>
      </Card>

      {/* Statistiken */}
      <Card>
        <div className={styles.statsCard}>
          <div className={styles.statItem}>
            <Body1Strong>{participants}</Body1Strong>
            <Body1>Teilnehmer</Body1>
          </div>
          <div className={styles.statItem}>
            <Body1Strong>{formatCost(hourlyRate)}</Body1Strong>
            <Body1>pro Person/h</Body1>
          </div>
          <div className={styles.statItem}>
            <Body1Strong>{formatCost(costPerMinute)}</Body1Strong>
            <Body1>pro Minute</Body1>
          </div>
        </div>
      </Card>
    </div>
  );
}

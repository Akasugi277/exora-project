'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ComingSoon from '@/components/ComingSoon';

type Lang = 'ja' | 'en';

type SectionKey = 'home' | 'notifications' | 'nickname' | 'time-language' | 'commands' | 'roles-permissions' | 'feature-member-join-leave' | 'feature-activity-role' | 'feature-levels' | 'feature-translation' | 'feature-polls' | 'feature-quote' | 'feature-music' | 'feature-logs' | 'posting-editing';

interface Props {
  bot: string;
  guildId: string;
  guildName: string;
  guildIcon: string | null;
  lang: Lang;
  section: SectionKey;
}

interface GuildSettingsState {
  nickname: string;
  dashboardLanguage: 'ja' | 'en';
  timezone: string;
  dateFormat: '24h' | '12h';
  notificationChannel: string;
  notifyHeartbeat: boolean;
  notifyModeration: boolean;
  notifyContentUpdates: boolean;
  commandPing: boolean;
  commandInfo: boolean;
  commandAdmin: boolean;
  adminRoleId: string;
  moderatorRoleId: string;
  allowManagers: boolean;
  featureMemberJoinLeave: boolean;
  featureActivityRole: boolean;
  featureLevels: boolean;
  featureTranslation: boolean;
  featurePolls: boolean;
  featureQuote: boolean;
  featureMusic: boolean;
  featureLogs: boolean;
}

const DEFAULT_SETTINGS: GuildSettingsState = {
  nickname: '',
  dashboardLanguage: 'ja',
  timezone: 'Asia/Tokyo',
  dateFormat: '24h',
  notificationChannel: '',
  notifyHeartbeat: true,
  notifyModeration: true,
  notifyContentUpdates: false,
  commandPing: true,
  commandInfo: true,
  commandAdmin: true,
  adminRoleId: '',
  moderatorRoleId: '',
  allowManagers: false,
  featureMemberJoinLeave: false,
  featureActivityRole: false,
  featureLevels: false,
  featureTranslation: false,
  featurePolls: false,
  featureQuote: false,
  featureMusic: false,
  featureLogs: true,
};

const T = {
  ja: {
    descriptions: {
      home: 'このサーバーに対する BOT 設定の概要です。',
      notifications: '通知先チャンネルと通知種別を管理します。',
      nickname: 'サーバー内での BOT 表示名を設定します。',
      'time-language': '表示言語と日時フォーマットを設定します。',
      commands: '利用可能なコマンドと管理者向けコマンドを設定します。',
      'roles-permissions': '管理権限を持つロールを設定します。',
      'feature-member-join-leave': 'メンバーの参加・退出時にメッセージを送信します。',
      'feature-activity-role': 'アクティビティに応じてロールを自動付与します。',
      'feature-levels': 'メッセージ活動に基づくレベルアップ機能です。',
      'feature-translation': 'リアクションでメッセージを翻訳します。',
      'feature-polls': '投票を作成・管理します。',
      'feature-quote': 'メッセージ ID で引用を作成します。',
      'feature-music': 'ボイスチャンネルで音楽を再生します。',
      'feature-logs': '各種アクションのログをチャンネルに出力します。',
      'posting-editing': 'サーバーページ向け投稿機能です。',
    },
    saveHint: 'ブラウザに自動保存されます。',
    guildId: 'サーバーID',
    bot: 'BOT',
    openServerList: 'サーバー一覧へ戻る',
    nicknameLabel: 'BOTのニックネーム',
    nicknamePlaceholder: '例: Exora Jupiter',
    languageLabel: '表示言語',
    timezoneLabel: 'タイムゾーン',
    dateFormatLabel: '時刻表示',
    notificationChannelLabel: '通知先チャンネル ID',
    adminRoleLabel: '管理者ロール ID',
    moderatorRoleLabel: 'モデレーターロール ID',
    heartbeatNotice: 'ハートビート異常を通知する',
    moderationNotice: 'モデレーション通知を送る',
    contentNotice: 'お知らせ更新を通知する',
    commandPing: '/ping を有効化',
    commandInfo: '/info を有効化',
    commandAdmin: '管理者コマンドを有効化',
    allowManagers: 'サーバー管理権限ユーザーにも設定変更を許可',
    featureMemberJoinLeave: 'メンバーの追加/退出メッセージ',
    featureActivityRole: 'アクティビティロール',
    featureLevels: 'レベル',
    featureTranslation: '翻訳',
    featurePolls: '投票',
    featureQuote: 'メッセージの引用',
    featureMusic: '音楽',
    featureLogs: 'ログ',
    featureEnable: 'この機能を有効にする',
    summaryTitle: 'クイックサマリー',
    summaryDesc: 'このサーバーで現在有効な主な設定です。',
    activeFeatures: '有効な機能',
    enabledCommands: '有効なコマンド',
    notificationReady: '通知設定',
    configured: '設定済み',
    notConfigured: '未設定',
    editThisSection: 'この設定を開く',
  },
  en: {
    descriptions: {
      home: 'Overview of bot settings for this server.',
      notifications: 'Manage notification channel and notification types.',
      nickname: 'Set how the bot is displayed inside this server.',
      'time-language': 'Configure language and time formatting.',
      commands: 'Configure available commands and admin-only commands.',
      'roles-permissions': 'Set roles that can manage the bot.',
      'feature-member-join-leave': 'Send messages when members join or leave.',
      'feature-activity-role': 'Automatically assign roles based on activity.',
      'feature-levels': 'Level up system based on message activity.',
      'feature-translation': 'Translate messages with a reaction.',
      'feature-polls': 'Create and manage polls.',
      'feature-quote': 'Quote messages by ID.',
      'feature-music': 'Play music in voice channels.',
      'feature-logs': 'Log various server actions to a channel.',
      'posting-editing': 'Posting features for server pages.',
    },
    saveHint: 'Saved automatically in this browser.',
    guildId: 'Server ID',
    bot: 'Bot',
    openServerList: 'Back to server list',
    nicknameLabel: 'Bot nickname',
    nicknamePlaceholder: 'Example: Exora Jupiter',
    languageLabel: 'Display language',
    timezoneLabel: 'Timezone',
    dateFormatLabel: 'Time format',
    notificationChannelLabel: 'Notification channel ID',
    adminRoleLabel: 'Admin role ID',
    moderatorRoleLabel: 'Moderator role ID',
    heartbeatNotice: 'Notify on heartbeat issues',
    moderationNotice: 'Send moderation notices',
    contentNotice: 'Notify on content updates',
    commandPing: 'Enable /ping',
    commandInfo: 'Enable /info',
    commandAdmin: 'Enable admin commands',
    allowManagers: 'Allow users with Manage Server to change settings',
    featureMemberJoinLeave: 'Member Join/Leave Messages',
    featureActivityRole: 'Activity Role',
    featureLevels: 'Levels',
    featureTranslation: 'Translation',
    featurePolls: 'Polls',
    featureQuote: 'Message Quoting',
    featureMusic: 'Music',
    featureLogs: 'Logs',
    featureEnable: 'Enable this feature',
    summaryTitle: 'Quick Summary',
    summaryDesc: 'Main settings currently active for this server.',
    activeFeatures: 'Active features',
    enabledCommands: 'Enabled commands',
    notificationReady: 'Notification setup',
    configured: 'Configured',
    notConfigured: 'Not configured',
    editThisSection: 'Open this setting',
  },
} as const;

const SECTION_TITLE: Record<Lang, Record<SectionKey, string>> = {
  ja: {
    home: 'ホーム',
    notifications: '通知',
    nickname: 'BOTのニックネーム',
    'time-language': '時刻と言語',
    commands: 'コマンド',
    'roles-permissions': '役職と権限',
    'feature-member-join-leave': 'メンバーの追加/退出メッセージ',
    'feature-activity-role': 'アクティビティロール',
    'feature-levels': 'レベル',
    'feature-translation': '翻訳',
    'feature-polls': '投票',
    'feature-quote': 'メッセージの引用',
    'feature-music': '音楽',
    'feature-logs': 'ログ',
    'posting-editing': '投稿と編集',
  },
  en: {
    home: 'Home',
    notifications: 'Notifications',
    nickname: 'Bot Nickname',
    'time-language': 'Time and Language',
    commands: 'Commands',
    'roles-permissions': 'Roles and Permissions',
    'feature-member-join-leave': 'Member Join/Leave Messages',
    'feature-activity-role': 'Activity Role',
    'feature-levels': 'Levels',
    'feature-translation': 'Translation',
    'feature-polls': 'Polls',
    'feature-quote': 'Message Quoting',
    'feature-music': 'Music',
    'feature-logs': 'Logs',
    'posting-editing': 'Post and Edit',
  },
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-text-base">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-base outline-none focus:border-accent-blue ${props.className ?? ''}`} />;
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-base outline-none focus:border-accent-blue ${props.className ?? ''}`} />;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface px-4 py-3 cursor-pointer">
      <span className="text-sm text-text-base">{label}</span>
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-accent-blue' : 'bg-border'}`}
      >
        <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </label>
  );
}

export default function GuildSettingsPageClient({ bot, guildId, guildName, guildIcon, lang, section }: Props) {
  const t = T[lang];
  const [settings, setSettings] = useState<GuildSettingsState>(DEFAULT_SETTINGS);
  const storageKey = useMemo(() => `exora:guild-settings:${bot}:${guildId}`, [bot, guildId]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<GuildSettingsState>;
      setSettings({ ...DEFAULT_SETTINGS, ...parsed });
    } catch {
      setSettings(DEFAULT_SETTINGS);
    }
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings, storageKey]);

  function update<K extends keyof GuildSettingsState>(key: K, value: GuildSettingsState[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  const activeFeatures = [
    settings.featureMemberJoinLeave && t.featureMemberJoinLeave,
    settings.featureActivityRole && t.featureActivityRole,
    settings.featureLevels && t.featureLevels,
    settings.featureTranslation && t.featureTranslation,
    settings.featurePolls && t.featurePolls,
    settings.featureQuote && t.featureQuote,
    settings.featureMusic && t.featureMusic,
    settings.featureLogs && t.featureLogs,
  ].filter(Boolean);

  const enabledCommands = [
    settings.commandPing && '/ping',
    settings.commandInfo && '/info',
    settings.commandAdmin && 'admin',
  ].filter(Boolean);

  function content() {
    switch (section) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface-alt px-5 py-4">
                <p className="text-xs text-text-muted mb-1">{t.notificationReady}</p>
                <p className="text-base font-semibold text-text-base">{settings.notificationChannel ? t.configured : t.notConfigured}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface-alt px-5 py-4">
                <p className="text-xs text-text-muted mb-1">{t.enabledCommands}</p>
                <p className="text-base font-semibold text-text-base">{enabledCommands.length}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface-alt px-5 py-4">
                <p className="text-xs text-text-muted mb-1">{t.activeFeatures}</p>
                <p className="text-base font-semibold text-text-base">{activeFeatures.length}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-alt px-6 py-5">
              <h2 className="text-lg font-semibold text-text-base mb-1">{t.summaryTitle}</h2>
              <p className="text-sm text-text-muted mb-4">{t.summaryDesc}</p>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs text-text-muted mb-1">{t.activeFeatures}</p>
                  <p className="text-sm text-text-base">{activeFeatures.length > 0 ? activeFeatures.join(', ') : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">{t.enabledCommands}</p>
                  <p className="text-sm text-text-base">{enabledCommands.length > 0 ? enabledCommands.join(', ') : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">{t.notificationReady}</p>
                  <p className="text-sm text-text-base">{settings.notificationChannel || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <Field label={t.notificationChannelLabel}>
              <TextInput value={settings.notificationChannel} onChange={(e) => update('notificationChannel', e.target.value)} placeholder="#alerts or channel id" />
            </Field>
            <Toggle label={t.heartbeatNotice} checked={settings.notifyHeartbeat} onChange={(value) => update('notifyHeartbeat', value)} />
            <Toggle label={t.moderationNotice} checked={settings.notifyModeration} onChange={(value) => update('notifyModeration', value)} />
            <Toggle label={t.contentNotice} checked={settings.notifyContentUpdates} onChange={(value) => update('notifyContentUpdates', value)} />
          </div>
        );
      case 'nickname':
        return (
          <Field label={t.nicknameLabel}>
            <TextInput value={settings.nickname} onChange={(e) => update('nickname', e.target.value)} placeholder={t.nicknamePlaceholder} maxLength={32} />
          </Field>
        );
      case 'time-language':
        return (
          <div className="grid gap-4 md:grid-cols-3">
            <Field label={t.languageLabel}>
              <Select value={settings.dashboardLanguage} onChange={(e) => update('dashboardLanguage', e.target.value as 'ja' | 'en')}>
                <option value="ja">日本語</option>
                <option value="en">English</option>
              </Select>
            </Field>
            <Field label={t.timezoneLabel}>
              <Select value={settings.timezone} onChange={(e) => update('timezone', e.target.value)}>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="UTC">UTC</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
              </Select>
            </Field>
            <Field label={t.dateFormatLabel}>
              <Select value={settings.dateFormat} onChange={(e) => update('dateFormat', e.target.value as '24h' | '12h')}>
                <option value="24h">24h</option>
                <option value="12h">12h</option>
              </Select>
            </Field>
          </div>
        );
      case 'commands':
        return (
          <div className="space-y-4">
            <Toggle label={t.commandPing} checked={settings.commandPing} onChange={(value) => update('commandPing', value)} />
            <Toggle label={t.commandInfo} checked={settings.commandInfo} onChange={(value) => update('commandInfo', value)} />
            <Toggle label={t.commandAdmin} checked={settings.commandAdmin} onChange={(value) => update('commandAdmin', value)} />
          </div>
        );
      case 'roles-permissions':
        return (
          <div className="space-y-4">
            <Field label={t.adminRoleLabel}>
              <TextInput value={settings.adminRoleId} onChange={(e) => update('adminRoleId', e.target.value)} placeholder="1234567890" />
            </Field>
            <Field label={t.moderatorRoleLabel}>
              <TextInput value={settings.moderatorRoleId} onChange={(e) => update('moderatorRoleId', e.target.value)} placeholder="1234567890" />
            </Field>
            <Toggle label={t.allowManagers} checked={settings.allowManagers} onChange={(value) => update('allowManagers', value)} />
          </div>
        );
      case 'feature-member-join-leave':
        return (
          <div className="space-y-4">
            <Toggle label={t.featureEnable} checked={settings.featureMemberJoinLeave} onChange={(value) => update('featureMemberJoinLeave', value)} />
          </div>
        );
      case 'feature-activity-role':
        return (
          <div className="space-y-4">
            <Toggle label={t.featureEnable} checked={settings.featureActivityRole} onChange={(value) => update('featureActivityRole', value)} />
          </div>
        );
      case 'feature-levels':
        return (
          <div className="space-y-4">
            <Toggle label={t.featureEnable} checked={settings.featureLevels} onChange={(value) => update('featureLevels', value)} />
          </div>
        );
      case 'feature-translation':
        return (
          <div className="space-y-4">
            <Toggle label={t.featureEnable} checked={settings.featureTranslation} onChange={(value) => update('featureTranslation', value)} />
          </div>
        );
      case 'feature-polls':
        return (
          <div className="space-y-4">
            <Toggle label={t.featureEnable} checked={settings.featurePolls} onChange={(value) => update('featurePolls', value)} />
          </div>
        );
      case 'feature-quote':
        return (
          <div className="space-y-4">
            <Toggle label={t.featureEnable} checked={settings.featureQuote} onChange={(value) => update('featureQuote', value)} />
          </div>
        );
      case 'feature-music':
        return (
          <div className="space-y-4">
            <Toggle label={t.featureEnable} checked={settings.featureMusic} onChange={(value) => update('featureMusic', value)} />
          </div>
        );
      case 'feature-logs':
        return (
          <div className="space-y-4">
            <Toggle label={t.featureEnable} checked={settings.featureLogs} onChange={(value) => update('featureLogs', value)} />
          </div>
        );
      case 'posting-editing':
        return <ComingSoon title={SECTION_TITLE[lang][section]} description={t.descriptions[section]} />;
      default:
        return null;
    }
  }

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="rounded-2xl border border-border bg-surface-alt px-6 py-5 mb-8">
        <div className="flex items-start gap-4">
          {guildIcon ? (
            <img
              src={`https://cdn.discordapp.com/icons/${guildId}/${guildIcon}.${guildIcon.startsWith('a_') ? 'gif' : 'png'}?size=64`}
              alt={guildName}
              width={44}
              height={44}
              className="rounded-full shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-border shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold text-text-base">{SECTION_TITLE[lang][section]}</h1>
            <p className="text-sm text-text-muted mt-1">{t.descriptions[section]}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs text-text-muted">
              <span>{t.bot}: {bot.charAt(0).toUpperCase() + bot.slice(1)}</span>
              <span>{t.guildId}: {guildId}</span>
              <span className="truncate max-w-full">{guildName}</span>
            </div>
            <p className="text-xs text-text-muted mt-2">{t.saveHint}</p>
          </div>
        </div>
      </div>

      {section !== 'posting-editing' ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-6">
          {content()}
        </div>
      ) : (
        content()
      )}

      <div className="mt-6">
        <Link href={`/bots/${bot}/servers?lang=${lang}`} className="text-sm text-accent-blue hover:opacity-80 transition-opacity">
          {t.openServerList}
        </Link>
      </div>
    </div>
  );
}
// Google Identity Services type declarations
declare namespace google.accounts.id {
  interface CredentialResponse {
    credential: string;
    select_by?: string;
  }

  interface PromptNotification {
    isNotDisplayed: () => boolean;
    isSkippedMoment: () => boolean;
    isDismissedMoment: () => boolean;
    getNotDisplayedReason: () => string;
    getSkippedReason: () => string;
    getDismissedReason: () => string;
  }

  interface InitializeConfig {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: 'signin' | 'signup' | 'use';
    itp_support?: boolean;
  }

  function initialize(config: InitializeConfig): void;
  function prompt(callback?: (notification: PromptNotification) => void): void;
  function cancel(): void;
  function disableAutoSelect(): void;
}

interface Window {
  google?: {
    accounts: {
      id: typeof google.accounts.id;
    };
  };
}

export const de = {
  layout: {
    header: {
      home: 'Übersicht',
      transactions: 'Transaktionen',
      deposits: 'Einzahlungen',
      withdrawals: 'Abhebungen',
      logout: 'Logout',
    },
  },
  auth: {
    register: {
      registerAnAccount: 'Erstelle einen Account',
      alreadyHaveAnAccount: 'Hast du bereits einen Account?',
      login: 'Einloggen',
      register: 'Registrieren',
      personalQuestions: 'Persönliches',
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'Email',
      age: 'Alter',
      address: 'Addresse',
      passwordQuestions: 'Wähle ein Passwort',
      password: 'Passwort',
      repeatPassword: 'Gebe dein Passwort erneut ein',
      addressQuestions: 'Gebe dein Addresse ein',
      country: 'Land',
      state: 'Bundesland',
      city: 'Stadt',
      zipCode: 'Plz.',
      street: 'Straße',
      house: 'Haus Nr.',
      notice:
        'Hiermit bestätigen Sie, dass Sie mit unseren Bedingungen einverstanden sind. ' +
        'Wir tragen keine Haft für die Sicherheit Ihrer Daten. ' +
        '<b>Bitte geben Sie keine echten Daten an</b>, ' +
        'da es sich hierbei nur um ein Demonstratives Projekt handelt.',
      response: {
        notChecked:
          'Du musst unseren Bedingungen zustimmen um einen Account erstellen zu können!',
        accountCreatedSuccessfully:
          'Dein Account wurde erfolgreich erstellt! Du wirst jetzt weitergeleitet.',
        conflict: 'Ein Account mit dieser Email Addresse existiert bereits.',
        internalServerError:
          'Ein unbekannter Serverfehler ist aufgetreten. Bitte versuche es später erneut.',
        error: 'Ein unbekannter Fehler ist aufgetreten.',
      },
    },
    login: {
      loginAccount: 'Logge dich in deinen Account ein',
      credentials: 'Account',
      email: 'Email',
      password: 'Passwort',
      login: 'Einloggen',
      register: 'Registrieren',
      dontHaveAnAccount: 'Hast du noch keinen Account?',
      response: {
        loginSuccess: 'Du hast dich erfolgreich eingeloggt! Du wirst demnächst weitergeleitet!',
        unauthorized: 'Dein angegebenes Passwort ist falsch.',
        notFound:
          'Es konnte kein Nutzer unter dieser Email Addresse gefunden werden.',
        internalServerError:
          'Ein unbekannter Serverfehler ist aufgetreten. Bitte versuche es später erneut.',
        error: 'Ein unbekannter Fehler ist aufgetreten.',
      },
    },
  },
  home: {
    profile: 'Profil',
    name: 'Name',
    email: 'Email',
    age: 'Alter',
    account: 'Konto',
    address: 'Addresse',
    balance: 'Guthaben',
    maxAllowance: 'Guthabenlimit',
    createdAt: 'Erstellt am',
    updatedAt: 'Zuletzt aktualisiert am',
    exchangedAmount: 'Transaktionsbetrag',
    sender: 'Sender',
    receiver: 'Empfänger',
    title: 'Grund',
    amount: 'Betrag',
  },
  statistics: {
    statistics: 'Statistiken',
    amount: 'Anzahl',
    lastCreated: 'Zuletzt Erstellt',
    firstCreated: 'Erstes Erstellt',
  },
  transactions: {
    transaction: 'Transaktion',
    add: 'Erstelle eine Transaktion',
    addReceiver: 'Füge die Informationen ein',
    receiver: 'Email des Empfängers',
    amount: 'Betrag',
    title: 'Titel',
    response: {
      withdrawalSuccess: 'Du hast erfolgreich eine Abhebung getätigt!',
      withdrawalBadRequest: 'Du hast dafür nicht genug Guthaben!',
      depositSuccess: 'Du hast erfolgreich Guthaben eingezahlt!',
      success: 'Die Transaktion wurde erfolgreich erstellt!',
      badRequest:
        'Du hast nicht genügend Guthaben um diese Transaktion durchzuführen.',
      notFound: 'Ein Empfänger mit dieser Email Addresse existiert nicht.',
      internalServerError:
        'Ein Serverfehler ist aufgetreten! Bitte versuche es später erneut.',
      error:
        'Ein unbekannter Fehler ist aufgetreten! Bitte überprüfe deine Eingaben.',
      requiredNotFulfilled: 'Du hast keine Eingaben getätigt.',
      tooLongInputs: 'Deine Eingaben waren zu lang, bitte überprüfe diese.',
      noValidEmailSet:
        'Du hast keine Gültige Email Addresse angegeben als Empfänger',
    },
  },
  balanceChanges: {
    addWithdrawal: 'Hier kannst du dein Guthaben abheben',
    withdrawal: 'Abhebung',
    addDeposit: 'Hier kannst du dein Guthaben aufladen',
    deposit: 'Einzahlung',
  },
};

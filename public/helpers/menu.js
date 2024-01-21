const screenItems = [
  {
    href: '/app/home',
    title: 'Acceuil'
  },
  // {
  //   href: '/app/account-daily',
  //   title: 'Journal de Banque'
  // },
  // {
  //   href: '/app/cash-daily',
  //   title: 'Journal de Caisse'
  // },
  {
    href: '/app/various-daily',
    title: 'Journal des operations diverse'
  },
  {
    href: '/app/accounts',
    title: 'Comptes'
  },
  {
    href: '/app/correspond',
    title: 'Communautés'
  },
  {
    href: '/app/exchange-rate',
    title: 'Saisie lignes budgetaires'
  }
  // {
  //   href: '/app/daily',
  //   title: 'Journaux'
  // }
];

module.exports = [
  {
    label: 'Fichier',
    submenu: [
      {
        label: 'Quiter',
        accelerator: 'CommandOrControl+Q',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.close();
        }
      }
    ]
  },

  {
    label: 'Saisies et Journalisations',
    submenu: screenItems.map((d) => ({
      label: d.title,
      click(item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.webContents.send('navigate-to', d.href);
        }
      }
    }))
  },
  {
    label: 'Rapports',
    click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.webContents.send('navigate-to', '/app/report');
      }
    }
  },
  {
    label: 'Utilisateur',
    submenu: [
      {
        label: 'Mon Compte',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.webContents.send('navigate-to', '/app/account');
          }
        }
      },
      {
        label: 'Se déconnecter',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.webContents.send('navigate-to', '/login');
          }
        }
      }
    ]
  },
  {
    label: 'Aide',
    role: 'help',
    submenu: [
      {
        label: 'Outils de developpement',
        role: 'toggleDevTools'
      },
      {
        label: 'Actualiser',
        role: 'reload',
        accelerator: 'CommandOrControl+R'
      },

      {
        label: 'Copyright © 2021 geoffreymakia@gmail.com'
      },
      {
        label: 'Version: 1.3.0'
      }
    ]
  }
];

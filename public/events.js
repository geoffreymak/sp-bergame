/* eslint-disable no-param-reassign */
/* eslint-disable indent */
const { ipcMain, BrowserWindow } = require('electron');
const PDFWindow = require('electron-pdf-window');
const path = require('path');
const url = require('url');
const reader = require('xlsx');
const compteModel = require('./models/comptes');
const exerciceModel = require('./models/exercices');
const deviseModel = require('./models/devises');
const ecritureModel = require('./models/ecritures');
const pastEcritureModel = require('./models/pastEcritures');
const correspondModel = require('./models/corresponds');
const userModel = require('./models/users');
const budgetModel = require('./models/budgets');
const pastBudgetModel = require('./models/pastBudgets');
const entiteModel = require('./models/entites');

const createReport = require('./report/createReport');
const getData = require('./report/getData');
// const dbFactoring = require('./helpers/data');
// const dbFactoring = require('./helpers/dbFormatDate');
// const correspond = require('./helpers/correspond');
// const fmouv = require('./helpers/fmouv21.json');
const CWD = process.cwd();

// const userModel = require('./models/users');
const events = () => {
  // eslint-disable-next-line no-unused-vars
  ipcMain.on('init-data', async (event, arg) => {
    try {
      // await ecritureModel.updateMany(
      //   { ref_imputation: '70780000' },
      //   { correspond: 'TD' }
      // );
      //  await ecritureModel.insertMany(dbFactoring(fmouv, 2021));

      // console.log('newData', newData);
      // await exerciceModel.create({ code: 2016, libelle: '2016' });

      const comptesData = await compteModel.find().sort({ compte: 1 }).lean();
      const entiteData = await entiteModel.find().sort({ code: 1 }).lean();
      const budgetData = await budgetModel.find().sort({ entite: 1 }).lean();
      const exerciceData = await exerciceModel.find().sort({ code: -1 }).lean();

      event.reply('init-data-reply', {
        error: false,
        data: {
          comptes: comptesData,
          entites: entiteData,
          budgets: budgetData,
          exercices: exerciceData
        }
      });
    } catch (error) {
      console.log('init-data-error', error);
      event.reply('init-data-reply', {
        error: true
      });
    }
  });

  ipcMain.handle('add-writing', async (event, arg) => {
    try {
      console.log(arg);
      await ecritureModel.insertMany(arg);

      return {
        error: false
      };
    } catch (error) {
      console.log('add-writing-error', error);
      return {
        error: true
      };
    }
  });

  ipcMain.handle('add-accompte', async (event, data) => {
    try {
      const result = await compteModel.create(data);
      return {
        error: false,
        data: JSON.stringify(result)
      };
    } catch (error) {
      console.log('add-accompte-error', error);
      return {
        error: true
      };
    }
  });

  ipcMain.handle('add-entite', async (event, data) => {
    try {
      const result = await entiteModel.create(data);
      return {
        error: false,
        data: JSON.stringify(result)
      };
    } catch (error) {
      console.log('add-entite-error', error);
      return {
        error: true
      };
    }
  });

  ipcMain.handle('add-correspond', async (event, data) => {
    try {
      const result = await correspondModel.create(data);
      return {
        error: false,
        data: JSON.stringify(result)
      };
    } catch (error) {
      console.log('add-correspond-error', error);
      return {
        error: true
      };
    }
  });

  ipcMain.handle('get-users', async (event, data) => {
    try {
      console.log('get-users');
      const usersData = await userModel.find().sort({ username: 1 }).lean();
      console.log('get-users', JSON.stringify(usersData));
      return {
        error: false,
        data: JSON.stringify(usersData)
      };
    } catch (error) {
      console.log('get-users-error', error);
      return {
        error: true
      };
    }
  });

  ipcMain.handle('get-writings', async (event, data) => {
    try {
      const writingsData = await ecritureModel.find().sort({ date: 1 }).lean();

      return {
        error: false,
        data: JSON.stringify(writingsData)
      };
    } catch (error) {
      console.log('get-writings-error', error);
      return {
        error: true
      };
    }
  });

  ipcMain.handle('correct-writing', async (event, { writings, piece }) => {
    try {
      if (writings && piece) {
        await ecritureModel.deleteMany({ piece });
        await ecritureModel.insertMany(writings);
        return {
          error: false
        };
      }
      return {
        error: true
      };
    } catch (error) {
      console.log('correct-writing-error', error);
      return {
        error: true
      };
    }
  });

  ipcMain.handle('add-devise', async (event, data) => {
    try {
      const result = await deviseModel.create(data);
      return {
        error: false,
        data: JSON.stringify(result)
      };
    } catch (error) {
      console.log('add-devise-error', error);
      return {
        error: true
      };
    }
  });

  ipcMain.handle('set-budget', async (event, data) => {
    try {
      const result = await budgetModel.create(data);
      return {
        error: false,
        data: JSON.stringify(result)
      };
    } catch (error) {
      console.log('set-budget-error', error);
      return {
        error: true
      };
    }
  });

  ipcMain.handle('update-budget', async (event, data) => {
    try {
      const result = await budgetModel.updateOne(
        { compte: data.compte, entite: data.entite },
        data
      );
      return {
        error: false,
        data: JSON.stringify(result)
      };
    } catch (error) {
      console.log('update-error', error);
      return {
        error: true
      };
    }
  });

  ipcMain.handle('load-xlsx', async (event, data) => {
    try {
      const xlsxFile = reader.readFile(
        path.resolve(path.join(CWD, 'mouvement.xlsx')),
        { cellDates: true }
      );
      const xlsxData = reader.utils.sheet_to_json(xlsxFile.Sheets['mouve']);

      return {
        error: false,
        data: JSON.stringify(xlsxData)
      };
    } catch (error) {
      console.log('update-error', error);
      return {
        error: true
      };
    }
  });

  ipcMain.handle('xlsx-path', () =>
    path.resolve(path.join(CWD, 'mouvement.xlsx'))
  );

  ipcMain.handle('close-exercice', async (event, data) => {
    try {
      const exerciceData = await exerciceModel.find().sort({ code: -1 }).lean();
      if (exerciceData[0]) {
        const ecritureData = await ecritureModel
          .find()
          .sort({ code: -1 })
          .lean();

        await pastEcritureModel.insertMany(ecritureData);
        await ecritureModel.deleteMany({});

        const budgetsData = await budgetModel.find().sort({ compte: 1 }).lean();
        await pastBudgetModel.insertMany(budgetsData);
        await budgetModel.deleteMany({});

        const result = await exerciceModel.create({
          code: exerciceData[0].code + 1,
          libelle: exerciceData[0].code + 1
        });

        return {
          error: false,
          data: JSON.stringify(result)
        };
      }
    } catch (error) {
      console.log('update-user-error', error);
      return {
        error: true
      };
    }
  });

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line consistent-return
  ipcMain.handle('print', async (event, data) => {
    try {
      const clearData = await getData(data);
      if (clearData) {
        const pdfPath = await createReport({ ...data, data: clearData });
        console.log('pdfPath', pdfPath);
        const win = new BrowserWindow({
          width: 1024,
          height: 800,
          title: data.title,
          icon: url.format(
            path.join(__dirname, '/images', '/icons', '/bergame.png')
          ),
          webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            plugins: true
          }
        });
        win.loadURL(url.pathToFileURL(pdfPath).href);
        win.menuBarVisible = false;
        win.webContents.on('did-finish-load', () => {
          if (win) {
            win.title = data.title;
          }
        });
        return { error: false, data: url.pathToFileURL(pdfPath).href };
        // event.reply('print-success', pdfPath);
      }
    } catch (error) {
      console.log('print error', error);
      return { error: true };
    }
  });
};

module.exports = events;

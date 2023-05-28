// modulos externos
import inquirer from "inquirer";
import chalk from "chalk";

// modulos internos
import fs from "fs";

operation()

// função que inicia o sistema
function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "Oque você deseja realizar?",
        choices: [
          'Criar Conta',
          'Consultar Saldo',
          'Depositar',
          'Sacar',
          'Sair'],
      }])
    .then(answer => {

      const action = answer['action']

      if (action === 'Criar Conta') {
        createAcount()
      } else if (action === 'Consultar Saldo') {
        deposit()
      } else if (action === 'Depositar') {

      } else if (action === 'Sacar') {

      } else if (action === 'Sair') {
        console.log(
          chalk.bgBlue.black("Obrigado por usar o RUBANK!")
        )
        process.exit()
      }

    }).catch(err => {
      console.log(err)
    })
}

// função que cria conta
function createAcount() {
  console.log(chalk.bgGreen(' Parabéns por escolher o banco RUBANK! '))
  console.log(chalk.green(' Defina as opções da sua conta a seguir: '))
  buildAccount()
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite um nome para sua conta:"

      },
    ])
    .then(answer => {

      const accountName = answer['accountName']

      if (!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts')
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRedBright('Essa conta já existe, escolha outro nome!')
        );
        buildAccount()
        return
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"ballance": 0}',
        (err) => {
          console.log(err)
        }
      )

      console.log(chalk.green.bold("PARABÉNS.Conta criada com sucesso!"))
      operation()

    }).catch(err => console.log(err))
}

// função que deposita um vaor na conta escolhida
function deposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da Conta? "
      }
    ])
    .then(answer => {
      const accountName = answer['accountName'];

      // verifica se a conta existe
      if(!checkAccount(accountName)) {
        return deposit()
      }


    })
    .catch(err => console.log(err))
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.red.italic("Essa conta não existe, Tente novamente!")
    )
    return false
  }
  return true
}
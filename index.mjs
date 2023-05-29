// modulos externos
import inquirer from "inquirer";
import chalk from "chalk";

// modulos internos
import fs, { writeFileSync } from "fs";
import { get } from "https";

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
          'Depositar',
          'Consultar Saldo',
          'Sacar',
          'Sair'
        ],
      }
    ])
    .then(answer => {

      const action = answer['action']

      if (action === 'Criar Conta') {
        createAcount()
      } else if (action === 'Depositar') {
        deposit()
      } else if (action === 'Consultar Saldo') {
        getAccountBallance()
      } else if (action === 'Sacar') {
        withdraw()
      } else if (action === 'Sair') {
        console.log(
          chalk.bgBlue.black("\nObrigado por usar o RUBANK!\n")
        )
        process.exit()
      }

    }).catch(err => {
      console.log(err)
    })
}

// Envia mensagem para o usuario e cria conta
function createAcount() {
  console.log(chalk.bgGreen('\n Parabéns por escolher o banco RUBANK! '))
  console.log(chalk.green(' Defina as opções da sua conta a seguir: \n'))
  buildAccount()
}

// cria a conta com dados do usuário
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

      // verifica se o nome para a conta está disponível
      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.red.italic('\nEssa conta já existe, escolha outro nome!\n'));
        buildAccount()
        return
      }

      // cria arquivo com dados da conta
      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"ballance": 0}',
        (err) => {
          console.log(err)
        }
      )

      console.log(chalk.green.bold("PARABÉNS.Conta criada com sucesso!\n"))
      operation()

    }).catch(err => console.log(err))
}

//deposita um valor na conta escolhida
function deposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta? "
      }
    ])
    .then(answer => {
      const accountName = answer['accountName'];

      // verifica se a conta existe
      if (!checkAccount(accountName)) {
        return deposit()
      }

      // pergunta os dados, nome da conta e valor a ser adicionado
      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja depositar? "
          }
        ])
        .then(answer => {
          const amount = answer['amount']

          // adicionando saldo
          addAmount(accountName, amount);
          operation();
        })
        .catch(err => console.log(err))


    })
    .catch(err => console.log(err))
}

// faz uma checagem se aconta existe
function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.red.italic("Essa conta não existe, Tente novamente!\n")
    )
    return false
  }
  return true
}

// adiciona um valor no saldo da conta
function addAmount(accountName, amount) {
  const accountData = getAccount(accountName)

  if (!amount) {
    console.log(chalk.red.italic("Ocorreu um erro, tente novamente mais tarde!\n"))
    return deposit()
  }

  accountData.ballance = parseFloat(amount) + parseFloat(accountData.ballance)

  // insere o valor na conta
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    err => console.log(err)
  )

  console.log(chalk.green.bold(`\nFoi depositado o valor de R$${amount} na sua conta!\n`))
}

// pega a conta que vai ser utilizada
function getAccount(accountName) {
  const accountjSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf-8',
    flag: "r"
  })

  return JSON.parse(accountjSON)
}

// puxa o saldo da conta do usuário
function getAccountBallance(){
  inquirer.prompt([
    {
      name: "accountName",
      message: "Qual nome da sua conta? "
    }
  ])
  .then(answer => {
    const accountName = answer['accountName']

    // verifica se a conta existe
    if(!checkAccount(accountName)){
      return getAccountBallance()
    }

    const accountData = getAccount(accountName);

    console.log(chalk.blue(`\nOlá, o saldo da sua conta é R$${accountData.ballance}\n`))
    operation()
  })
  .catch(err => console.log(err))
}

// saca o valor da conta do usuário
function withdraw(){
  inquirer.prompt([
    {
      name: "accountName",
      message: "Qual o nome da conta? "
    }
  ])
  .then(answer => {
    const accountName = answer['accountName'];

    if(!checkAccount(accountName)){
      return withdraw()
    }

    inquirer.prompt([
      {
        name: "amount",
        message: "Quanto você deseja sacar? "
      }
    ])
    .then(answer => {
      const amount = answer['amount']

      withdrawAmount(accountName, amount)
    })
    .catch(err => console.log(err))
    
  })
  .catch(err => console.log(err))
}

// retira a quantia da conta do conta escolhida
function withdrawAmount(accountName, amount){
  const accountData = getAccount(accountName)

  if(!amount){
    console.log(chalk.red.italic("Ocorreu um erro, tente novamente mais tarde!\n"))
    return withdraw()
  }

  if(accountData.ballance < amount){
    console.log(chalk.red.italic('Valor indisponível!\n'))
    return withdraw()
  }

  accountData.ballance = parseFloat(accountData.ballance) - parseFloat(amount)

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    err => console.log(err)
  )
  
  console.log(chalk.green.bold(`\nFoi realizado um saque de R$${amount} da sua conta!\n`))
  operation()

}
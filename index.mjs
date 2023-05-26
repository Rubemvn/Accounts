// modulos externos
import inquirer from "inquirer";
import chalk, { Chalk } from "chalk";

// modulos internos
import fs, { mkdir } from "fs";
import { create } from "domain";

operation()

function operation() {
    inquirer
        .prompt([{
            type: "list",
            name: "action",
            message: "Oque você deseja realizar?",
            choices: ['Criar Conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],
        }])
        .then(answer => {

            const action = answer['action']
            console.info(action)

            if (action === 'Criar Conta') {
                createAcount()
            }

        }).catch(err => {
            console.log(err)
        })
}

function createAcount() {
    console.log(chalk.bgGreen(' Parabéns por escolher o banco RUBANK! '))
    console.log(chalk.green(' Defina as opções da sua conta a seguir: '))
    buildAccount()
}

function buildAccount() {
    inquirer.prompt([{
        name: "accountName",
        message: "Digite um nome para sua conta:"

    }]).then(answer => {

        const accountName = answer['accountName']

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}`)) {
            console.log(
                chalk.bgRedBright('Essa conta já existe, escolha outro nome!')
            )
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
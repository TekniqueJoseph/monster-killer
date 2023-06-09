const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 30;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

let battleLog = [];
let lastLoggedEntry;

function getMaxLifeValues () {
    const enteredValue = prompt('Set the Maximum Life for You & The Bastid.', '100')
    const parsedValue = parseInt(enteredValue)
    if (isNaN(parsedValue) || parsedValue <=0) {
        throw {message: 'Invalid user input, not a number'}
    };
    return parsedValue
}

let chosenMaxLife;

try {
    chosenMaxLife = getMaxLifeValues()
} catch (error) {
    console.log(error)
    chosenMaxLife = 100;
    alert('Your entry was invalid, default Maximum of 100 was used.');
    // throw error;
} 

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife) 

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalePlayerHealth: playerHealth
    };

    switch(ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry = {
                event: ev,
                value: val,
                target: 'MONSTER',
                finalMonsterHealth: monsterHealth,
                finalePlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry = {
                event: ev,
                value: val,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalePlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry = {
                event: ev,
                value: val,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalePlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: ev,
                value: val,
                finalMonsterHealth: monsterHealth,
                finalePlayerHealth: playerHealth
            };
            break;
        default:
            logEntry = {};
    }

    // if(ev === LOG_EVENT_PLAYER_ATTACK){
    //     logEntry.target = 'MONSTER';
    // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         target: 'MONSTER',
    //         finalMonsterHealth: monsterHealth,
    //         finalePlayerHealth: playerHealth
    //     };
    // } else if (ev === LOG_EVENT_MONSTER_ATTACK){
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         target: 'PLAYER',
    //         finalMonsterHealth: monsterHealth,
    //         finalePlayerHealth: playerHealth
    //     };
    // } else if(ev === LOG_EVENT_PLAYER_HEAL) {
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         target: 'PLAYER',
    //         finalMonsterHealth: monsterHealth,
    //         finalePlayerHealth: playerHealth
    //     };
    // } else if (ev === LOG_EVENT_GAME_OVER) {
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         finalMonsterHealth: monsterHealth,
    //         finalePlayerHealth: playerHealth
    //     };
    // }
    battleLog.push(logEntry)
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife)
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
    currentPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK, 
        playerDamage, 
        currentMonsterHealth, 
        currentPlayerHealth
    );

    if(currentPlayerHealth <= 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife()
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('A Bonus Gave You Some Life. USE IT!!')
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
      alert('You got the Bastid!!')
      writeToLog(
        LOG_EVENT_GAME_OVER, 
        'The Bastids DOWN', 
        currentMonsterHealth, 
        currentPlayerHealth
    );
    } else if (currentPlayerHealth <= 0  && currentMonsterHealth > 0) {
      alert('The Bastid dealt you an L.')
      writeToLog(
        LOG_EVENT_GAME_OVER, 
        'YOU DID NOT TRIUMP', 
        currentMonsterHealth, 
        currentPlayerHealth
    );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <=0){
      alert('Both you and the Bastid failed your respected purposes')
      writeToLog(
        LOG_EVENT_GAME_OVER, 
        'A FRUITLESS AFFAIER', 
        currentMonsterHealth, 
        currentPlayerHealth
    );
    }

    if (currentMonsterHealth <= 0 || currentPlayerHealth <=0) {
            reset()
    }
}

function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK 
    ? LOG_EVENT_PLAYER_ATTACK 
    : LOG_EVENT_PLAYER_STRONG_ATTACK;
    // if(mode === MODE_ATTACK) {
    //     maxDamage = ATTACK_VALUE
    //     logEvent = LOG_EVENT_PLAYER_ATTACK
    // } else if (mode === MODE_STRONG_ATTACK) {
    //     maxDamage = STRONG_ATTACK_VALUE
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK
    // }
    const damage = dealMonsterDamage(maxDamage)  
    currentMonsterHealth -= damage;
    writeToLog(
        logEvent, 
        damage, 
        currentMonsterHealth, 
        currentPlayerHealth
    );
    endRound()
}

function attackHandler() {
    attackMonster(MODE_ATTACK)
}
function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK)
}
function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert("You can't Heal more than you were at First...")
        healValue = chosenMaxLife - currentPlayerHealth
    } else healValue = HEAL_VALUE;
    increasePlayerHealth(healValue)
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL, 
        healValue, 
        currentMonsterHealth, 
        currentPlayerHealth
    );
    endRound()
}

function printLogHandler() {
    let sum = 0;
    for (let i=0; i < 3; i++) {
        sum = sum + i
        console.log('------------')
        break
    }
    // console.log(sum)

    let j = 0;
    // do {
    //     console.log(`Outer loop is j ${j}`)
    //     for (let k = 0; k < 5; k++) {
    //         console.log(`Inner is k ${k}`)
    //     }
    //     j++;
    // }while (j < 3)
    // outerWhile: do {
    //     console.log(`Outer loop is j ${j}`)
    //     innerFor: for (let k = 0; k < 5; k++) {
    //         if (k === 3) {
    //             continue
    //             // break outerWhile;
    //             // continue outerWhile; //dangerous use here. creates infinite loop
    //         }
    //         console.log(`Inner is k ${k}`)
    //     }
    //     j++;
    // }while (j < 3)
    

    // for(let i = 10; i > 0; i--){
    //     console.log(i)
    // }
    // for (let i = 0; i < battleLog.length; i ++) {
    //     console.log(battleLog[i])
    // }
    // let i = 0;
    //     for (const logEntry of battleLog) {
    //         console.log(logEntry)
    //         console.log(i);
    //         i++;
    //     }
    let i = 0;
    for (const logEntry of battleLog) {
        if(!lastLoggedEntry && lastLoggedEntry !== 0 || lastLoggedEntry < i) {
            console.log(`#${i}`);
            for (const key in logEntry) {
                console.log(`${key} => ${logEntry[key]}`)
            }
            lastLoggedEntry = i;
            break;
        }
            i++; 
    }
}

attackBtn.addEventListener('click', attackHandler)
strongAttackBtn.addEventListener('click', strongAttackHandler)
healBtn.addEventListener('click', healPlayerHandler)
logBtn.addEventListener('click', printLogHandler)

// // let ran = []
// // let finished = false;
// // while (!finished) {
// //     const rndNum = Math.random();
// //     ran.push(rndNum);
// //     if (rndNum > 0.5) {
// //         finished = true
// //     }   console.log(ran);
// // }

// // let ran = []
// // let ran2 = []
// // let finished = false;
// // while (!finished) {
// //     const rndNum = Math.random();
// //     const rndNum2 = Math.random()
// //     ran.push(rndNum);
// //     ran2.push(rndNum2)


// let finished1 = false;
//     const rndNum = Math.random();
//     const rndNum2 = Math.random()
//     if ((rndNum >.7 && rndNum2 > .7) || (rndNum <= .2 || rndNum2 <= .2)) { 
//         console.log(`Complete. The 1st # is ${rndNum} & the 2nd # is ${rndNum2}.`)
//     } else {
//         console.log('None of the conditions were met.')
//     }
// // let sum1 = 0;
// // for (let l = 0; l < 5; l++){
// //     for (let m = 0; m < 2; m++){
// //         sum1 = sum1 + l + m
// //         continue // no effect if a condition isnt given to continue to work on
// //     }
// // }
// // console.log(`Sum1 => ${sum1}`)

// function breakMe(a) {
//     if(a > 5) {
//         throw {message: `${a} is greater than 5. Number must be 5 or less`}
//     } else {
//         console.log(`${a} is acceptable. Error handled successfully.`)
//     }
//     return a
// }
// try {
//     breakMe(100)
// }catch (error) {
//     main(error)
//     function main(error) {
//         console.log(error);
//         let a;
//         breakMe(2);
//         return {message: `${a} is greater than 5. Number must be 5 or less`}
//     }
// }

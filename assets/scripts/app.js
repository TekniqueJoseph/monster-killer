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

const enteredValue = prompt('Set the Maximum Life for You & The Bastid.', '100')

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if(isNaN(chosenMaxLife) || chosenMaxLife <=0) {
    chosenMaxLife = 100;
};

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
    if(ev === LOG_EVENT_PLAYER_ATTACK){
        logEntry.target = 'MONSTER';
    } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalePlayerHealth: playerHealth
        };
    } else if (ev === LOG_EVENT_MONSTER_ATTACK){
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalePlayerHealth: playerHealth
        };
    } else if(ev === LOG_EVENT_PLAYER_HEAL) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalePlayerHealth: playerHealth
        };
    } else if (ev === LOG_EVENT_GAME_OVER) {
        logEntry = {
            event: ev,
            value: val,
            finalMonsterHealth: monsterHealth,
            finalePlayerHealth: playerHealth
        };
    }
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
    let maxDamage;
    let logEvent;
    if(mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE
        logEvent = LOG_EVENT_PLAYER_ATTACK
    } else if (mode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK
    }
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
    console.log(battleLog)
}

attackBtn.addEventListener('click', attackHandler)
strongAttackBtn.addEventListener('click', strongAttackHandler)
healBtn.addEventListener('click', healPlayerHandler)
logBtn.addEventListener('click', printLogHandler)
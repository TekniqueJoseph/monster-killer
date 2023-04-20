const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 30;
const  MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';

const enteredValue = prompt('Set the Maximum Life for You & The Basted.', '100')

let chosenMaxLife = parseInt(enteredValue);

if(isNaN(chosenMaxLife) || chosenMaxLife <=0) {
    chosenMaxLife = 100;
};

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife) 

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife)
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
    currentPlayerHealth -= playerDamage;

    if(currentPlayerHealth <= 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife()
        currentPlayerHealth = initialPlayerHealth;
        alert('The Bonus Gave You Some Life. USE IT!!')
        setPlayerHealth(initialPlayerHealth);
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
      alert('You got the bastid!!')
    } else if (currentPlayerHealth <= 0  && currentMonsterHealth > 0) {
      alert('L for you this time.')
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <=0){
      alert('You both have failed your respected purposes')
    }

    if (currentMonsterHealth <= 0 || currentPlayerHealth <=0) {
            reset()
    }
}

function attackMonster(mode) {
    let maxDamage;
    if(mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE
    } else if (mode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE
    }
    const damage = dealMonsterDamage(maxDamage)  
    currentMonsterHealth -= damage;
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
        alert("You can't heal more than you were at first...")
        healValue = chosenMaxLife - currentPlayerHealth
    } else healValue = HEAL_VALUE;
    increasePlayerHealth(healValue)
    currentPlayerHealth += healValue;
    endRound()
}

attackBtn.addEventListener('click', attackHandler)
strongAttackBtn.addEventListener('click', strongAttackHandler)
healBtn.addEventListener('click', healPlayerHandler)
const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;

let chosenMaxLife = 100;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHeakth= chosenMaxLife;

adjustHealthBars(chosenMaxLife)

function attackMonster(mode) {
    let maxDamage;
    if(mode === 'ATTACK') {
        maxDamage = ATTACK_VALUE
    } else if (mode === 'STRONG_ATTACK') {
        maxDamage = STRONG_ATTACK_VALUE
    }
    const damage = dealMonsterDamage(maxDamage)  
    currentMonsterHealth -= damage;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
    currentPlayerHeakth -= playerDamage;
    if (currentMonsterHealth <= 0 && currentPlayerHeakth > 0) {
      alert('You got the bastard!!!')
    } else if (currentPlayerHeakth <= 0  && currentMonsterHealth > 0) {
      alert('L for you this time.')
    } else if (currentPlayerHeakth <= 0 && currentMonsterHealth <=0){
      alert('You both have failed your respected purposes')
    }
}

function attackHandler() {
    attackMonster('ATTACK')
}

function strongAttackHandler() {
    attackMonster('STRONG_ATTACK')
}

attackBtn.addEventListener('click', attackHandler)
strongAttackBtn.addEventListener('click', strongAttackHandler)
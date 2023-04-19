const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;

let chosenMaxLife = 5;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHeakth= chosenMaxLife;

adjustHealthBars(chosenMaxLife)

function attackHandler() {
  const damage = dealMonsterDamage(ATTACK_VALUE)  
  currentMonsterHealth -= damage;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
  currentPlayerHeakth -= playerDamage;
  if (currentMonsterHealth <= 0 && currentPlayerHeakth > 0) {
    alert('You got the bastard!!!')
  } else if (currentPlayerHeakth <= 0  && currentMonsterHealth > 0) {
    alert('L for you this time.')
  } else if (currentPlayerHeakth <= 0 && currentMonsterHealth <=0){
    alert('You both have failed your respected purpose')
  }
}

attackBtn.addEventListener('click', attackHandler)
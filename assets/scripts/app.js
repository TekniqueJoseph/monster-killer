const ATTACK_VALUE = 10;

let chosenMaxLife = 100;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHeakth= chosenMaxLife;

adjustHealthBars(chosenMaxLife)

function attackHandler() {
  const damage = dealMonsterDamage(ATTACK_VALUE)  
  currentMonsterHealth -= damage;
  if (currentMonsterHealth <= 0) {
    alert('You got the bastard!!!')
  }
}

attackBtn.addEventListener('click', attackHandler)
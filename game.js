import chalk from 'chalk';
import readlineSync from 'readline-sync';

//플레이어 클레스 hp, 공격력
class Player {
  constructor() {
    this.hp = 100;
    this.playerattack = 10;
  }
//몬스터를 공격할시
  attack(monster) {
    const damage = this.playerattack
    monster.hp -= damage;
    return damage;
  }
//스테이지 종료후 회복
  heal(amount) {
    this.hp += amount;
  }
}
//몬스터 클레스 hp, 공격력
class Monster {
  constructor(stage) {
    this.hp = 50
    this.monsterattack = 5
  }
//플레이어 공격할시
  attack(player) {
    const damage = this.monsterattack
    player.hp -= damage;
    return damage;
  }
}

//스테이지, 플레이어 정보, 몬스터 정보
function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(`| 플레이어 HP: ${player.hp} (승리할시 +50hp) 플레이어 공격력: ${player.playerattack}`) +
    chalk.redBright(`| 몬스터 HP: ${monster.hp} 몬스터 공격력:${monster.monsterattack}|`),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

//배틀 페이즈 - 몬스터와 싸우고 플레이어의 hp가 몬스터보다 1.많으면 다음 스테이지, 회복 2. 적으면 패배
const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(`\n1. 공격한다 2. 아무것도 하지않는다.`),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    if (choice === '1') {
      const playerattack = player.attack(monster);
      logs.push(chalk.green(`플레이어가 몬스터에게 ${playerattack}의 피해를 입혔습니다.`));
    } else {
      logs.push(chalk.yellow(`플레이어가 가만히 있습니다.`));
    }

    if (monster.hp > 0) {
      const monsterattack = monster.attack(player);
      logs.push(chalk.red(`몬스터가 플레이어에게 ${monsterattack}의 피해를 입혔습니다.`));
    }
  }
};

//처음 설정
export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    if (player.hp <= 0) {
      console.log(chalk.redBright('게임 오버! 다시 도전하세요.'));
      break;
    }

    player.heal(50);
    stage++;
  }

  if (player.hp > 0) {
    console.log(chalk.greenBright('축하합니다! 승리!'));
  }
}

const typesTable = {
    colorless: { debilidades: ['fighting'], fortalezas: [] },
    fire: { debilidades: ['water', 'rock', 'fire'], fortalezas: ['grass', 'ice'] },
    water: { debilidades: ['llightning', 'grass'], fortalezas: ['fire', 'rock'] },
    grass: { debilidades: ['fire', 'ice', 'posion', 'flight', 'bug'], fortalezas: ['water', 'ground'] },
    lightning: { debilidades: ['ground'], fortalezas: ['water'] },
    fighting: { debilidades: ['flight', 'psychic', 'fairy'], fortalezas: ['colorless', 'ice', 'rock'] },
    rock: { debilidades: ['water', 'grass', 'fighting', 'ground', 'metal'], fortalezas: ['fire', 'ice', 'flight'] },
    ice: { debilidades: ['fire', 'fighting', 'rock', 'metal'], fortalezas: ['grass', 'ground', 'flight'] },
    posion: { debilidades: ['ground', 'psychic'], fortalezas: ['grass', 'fairy'] },
    flight: { debilidades: ['lightning', 'ice', 'rock'], fortalezas: ['grass', 'fighting', 'bug'] },
    psychic: { debilidades: ['bug', 'ghost', 'darkness'], fortalezas: ['fighting', 'posion'] },
    bug: { debilidades: ['fire', 'flight', 'rock'], fortalezas: ['grass', 'psychic', 'darkness'] },
    ghost: { debilidades: ['colorless', 'fighting'], fortalezas: ['psychic', 'ghost'] },
    darkness: { debilidades: ['fighting', 'bug', 'fairy'], fortalezas: ['psychic', 'darkness'] },
    dragon: { debilidades: ['ice', 'dragon', 'fairy'], fortalezas: ['dragon'] },
    metal: { debilidades: ['fire', 'fighting', 'ground'], fortalezas: ['ice', 'rock'] },
    fairy: { debilidades: ['posion', 'metal'], fortalezas: ['fighting', 'bug', 'dragon'] },
};

function calcularMultiplicadores(tipo1, tipo2) {
    const multiplicadorTipo1 = calcularMultiplicador(tipo1, tipo2);
    const multiplicadorTipo2 = calcularMultiplicador(tipo2, tipo1);

    return {
        tipo1: multiplicadorTipo1,
        tipo2: multiplicadorTipo2,
    };
}

function calcularMultiplicador(tipoAtacante, tipoDefensor) {
    if (typesTable[tipoAtacante] && typesTable[tipoDefensor]) {
        const debilidades = typesTable[tipoDefensor].debilidades;
        const fortalezas = typesTable[tipoDefensor].fortalezas;

        if (debilidades.includes(tipoAtacante)) {
            return 2; // x2 - Muy efectivo
        } else if (fortalezas.includes(tipoAtacante)) {
            return 0.5; // x0.5 - Poco efectivo
        } else {
            return 1; // x1 - Efectivo
        }
    } else {
        return 0; // x0 - Tipo no válido
    }
}

function isCritical() {
    return Math.random() < 0.0625 ? 2 : 1; // 6.25% de probabilidad de que sea crítico
}

function avoidChance() {
    return Math.random() < 0.0625 ? 0 : 1; // 6.25% de probabilidad de que falle
}

function cleanDamage(damage) {
    return parseInt(damage.replace(/\D/g, ''));
}

function getRandomAttack(attacks) {
    if (!attacks || attacks.length === 0) {
        return null;
    }
    // Sort attacks by cost in descending order
    attacks.sort((a, b) => b.cost - a.cost);

    // Calculate total cost to determine probabilities
    const totalCost = attacks.reduce((sum, attack) => sum + attack.cost, 0);

    // Generate a random number between 0 and totalCost
    const random = Math.random() * totalCost;

    // Iterate through attacks and determine the chosen attack
    let cumulativeCost = 0;
    for (const attack of attacks) {
        cumulativeCost += attack.cost;
        if (random < cumulativeCost) {
            return attack;
        }
    }

    // This line should not be reached, but in case of issues, return a random attack
    return attacks[Math.floor(Math.random() * attacks.length)];
}


export const battleEngine = (userCard, pcCard, attack, isChange) => {
    const {tipo1, tipo2} = calcularMultiplicadores(userCard.types[0].toLowerCase(), pcCard.types[0].toLowerCase())
    const messages = [];
    const pcAttack = getRandomAttack(pcCard.attacks.filter(attack => attack.damage !== '')); // Filtrar ataques sin daño
    const userAttackDamage = isChange ? 0 : cleanDamage(attack.damage);
    const pcAttackDamage = cleanDamage(pcAttack ? pcAttack.damage : "10");
    const userCritical = isCritical();
    const pcCritical = isCritical();
    const userAvoid = avoidChance();
    const pcAvoid = avoidChance();
    const userCardHp = userCard.hp - pcAttackDamage * tipo2 * pcCritical * userAvoid;
    const pcCardHp = pcCard.hp - userAttackDamage * tipo1 * userCritical * pcAvoid;

    !isChange && messages.push(`${userCard.name}: ha atacado a ${pcCard.name} con ${attack.name} y ha hecho ${userAttackDamage * tipo1 * userCritical * pcAvoid} de daño`);
    !isChange && userCritical === 2 ? messages.push('CRITICO!!!') : null;
    !isChange && pcAvoid === 0 ? messages.push('FALLO!!!') : null;
    messages.push(`${pcCard.name}: ha atacado a ${userCard.name} con ${pcAttack ? pcAttack.name : "combat"} y ha hecho ${pcAttackDamage * tipo2 * pcCritical * userAvoid} de daño`);
    pcCritical === 2 ? messages.push('CRITICO!!!') : null;
    userAvoid === 0 ? messages.push('FALLO!!!') : null;

    return {
        userCardHp: userCardHp < 0 ? 0 : userCardHp,
        pcCardHp: pcCardHp < 0 ? 0 : pcCardHp,
        message: messages
    }
}
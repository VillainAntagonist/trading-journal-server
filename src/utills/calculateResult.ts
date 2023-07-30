export function calculateResult(enter: number, exit: number, type: "Short" | "Long", symbol: string, size: number ): {pips: number, net: number, result: 'Win' | "Loss" } {
const [base, quoted] = symbol.split("/")
    const decimalPlace = quoted === "JPY" ? 2 : 4
    const pipMovement = decimalPlace === 4 ? 0.0001 : 0.01;

    let pips;

    if(type === "Short"){
        pips = (enter-exit)/ pipMovement;
    }else {
        pips = (exit-enter)/ pipMovement
    }

     pips = Number(pips.toFixed(2));
    const net = Number((pips * pipMovement * size).toFixed(2));


    const result = pips > 0 ? 'Win' : "Loss"

    return {pips, net, result}

}

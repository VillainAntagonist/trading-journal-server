import {calculateResult} from "../utills/calculateResult";

describe('calculateResult', () => {
    it('should correctly calculate pips, net, and result for a long trade', () => {
        const enter = 1.1700;
        const exit = 1.1800;
        const tradeType = 'Long';
        const symbol = 'EUR/USD';
        const size = 100000;

        const expectedOutput = {
            pips: 100,
            net: 1000,
            result: 'Win',
        };

        const result = calculateResult(enter, exit, tradeType, symbol, size);
        expect(result).toEqual(expectedOutput);
    });

    it('should correctly calculate pips, net, and result for a short trade', () => {
        const enter = 1.1800;
        const exit = 1.1700;
        const tradeType = 'Short';
        const symbol = 'EUR/USD';
        const size = 100000;

        const expectedOutput = {
            pips: 100,
            net: 1000,
            result: 'Win',
        };

        const result = calculateResult(enter, exit, tradeType, symbol, size);
        expect(result).toEqual(expectedOutput);
    });

    it('should correctly calculate pips, net, and result for a long trade with JPY quoted pair', () => {
        const enter = 110.50;
        const exit = 111.50;
        const tradeType = 'Long';
        const symbol = 'USD/JPY';
        const size = 100000;

        const expectedOutput = {
            pips: 100,
            net: 100000,
            result: 'Win',
        };

        const result = calculateResult(enter, exit, tradeType, symbol, size);
        expect(result).toEqual(expectedOutput);
    });

    it('should correctly calculate pips, net, and result for a short trade with JPY quoted pair', () => {
        const enter = 111.50;
        const exit = 110.50;
        const tradeType = 'Short';
        const symbol = 'USD/JPY';
        const size = 100000;

        const expectedOutput = {
            pips: 100,
            net: 100000,
            result: 'Win',
        };

        const result = calculateResult(enter, exit, tradeType, symbol, size);
        expect(result).toEqual(expectedOutput);
    });
});

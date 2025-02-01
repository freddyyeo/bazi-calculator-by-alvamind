# Bazi Calculator by Alvamind

A comprehensive and accurate Bazi (Four Pillars of Destiny) calculator for Node.js environments. This package provides a modern, modular, and efficient way to calculate and analyze Bazi charts, incorporating key aspects like Five Elements analysis, Eight Mansions, and more.

[![npm version](https://badge.fury.io/js/bazi-calculator-by-alvamind.svg)](https://badge.fury.io/js/bazi-calculator-by-alvamind)

## Features

- **Accurate Bazi Calculations:** Calculates the Four Pillars (Year, Month, Day, and Hour) accurately using provided date and time.
- **Five Elements Analysis:** Provides a detailed breakdown of the five elements (Wood, Fire, Earth, Metal, Water) and their distribution in the chart.
- **Day Master Analysis:** Identifies the Day Master's element, nature (Yin/Yang), and related information.
- **Eight Mansions:** Calculates and provides interpretations for the Eight Mansions based on the user's Gua.
- **Key Shen Sha:** Identifies key Shen Sha (Spirits and Influences) such as the Nobleman, Intelligence, Sky Horse, and Peach Blossom.
- **Modular and Maintainable:** Designed with SOLID principles, making it easy to extend and maintain.
- **TypeScript Support:** Built with TypeScript, providing type safety and a better development experience.
- **ES Module Support:** Compatible with modern JavaScript environments using ES modules.

## Installation

```bash
npm install bazi-calculator-by-alvamind
```

## Usage

Here's a basic example of how to use the `BaziCalculator` in your Node.js project:

```typescript
import { BaziCalculator } from 'bazi-calculator-by-alvamind';

// Create a new BaziCalculator instance with the birth details
const calculator = new BaziCalculator(1990, 5, 10, 12, 'male');

// Get the complete analysis, including pillars and basic analysis
const analysis = calculator.getCompleteAnalysis();
console.log(analysis);

// Get the string representation of the pillars
console.log(calculator.toString());

// You can also calculate the basic analysis separately
const basicAnalysis = calculator.calculateBasicAnalysis();
console.log(basicAnalysis);

// You can also get the pillars separately
const pillars = calculator.calculatePillars();
console.log(pillars)
```

**Output Example**
```json
{
  "mainPillars": {
    "year": {
      "chinese": "庚午",
      "element": "METAL",
      "animal": "Horse",
      "branch": {
        "element": "FIRE"
      }
    },
    "month": {
      "chinese": "辛巳",
      "element": "METAL",
      "animal": "Snake",
      "branch": {
        "element": "FIRE"
      }
    },
    "day": {
      "chinese": "乙酉",
      "element": "WOOD",
      "animal": "Rooster",
      "branch": {
        "element": "METAL"
      }
    },
    "time": {
      "chinese": "壬午",
      "element": "WATER",
      "animal": "Horse",
      "branch": {
        "element": "FIRE"
      }
    }
  },
  "basicAnalysis": {
    "lifeGua": 1,
    "dayMaster": {
      "stem": "乙",
      "nature": "Yin",
      "element": "WOOD"
    },
    "nobleman": [
      "子",
      "申"
    ],
    "intelligence": "巳",
    "skyHorse": "卯",
    "peachBlossom": "酉",
    "fiveFactors": {
      "WOOD": 13,
      "FIRE": 38,
      "EARTH": 0,
      "METAL": 38,
      "WATER": 12
    },
    "eightMansions": {
      "group": "East",
      "lucky": {
        "wealth": "SE",
        "health": "E",
        "romance": "S",
        "career": "N"
      },
      "unlucky": {
        "obstacles": "NW",
        "quarrels": "W",
        "setbacks": "SW",
        "totalLoss": "NE"
      }
    }
  }
}
```

```
庚午年辛巳月乙酉日壬午時
```

**Constructor Parameters:**

- `year` (number): The year of birth (Gregorian calendar).
- `month` (number): The month of birth (1-12).
- `day` (number): The day of birth (1-31).
- `hour` (number): The hour of birth (0-23).
- `gender` (string, optional): The gender of the person ('male' or 'female'). Defaults to 'male'.

## API Reference

### `BaziCalculator` Class

#### Constructor

```typescript
constructor(year: number, month: number, day: number, hour: number, gender?: 'male' | 'female')
```

Creates a new `BaziCalculator` instance with the given birth details.

#### Methods

##### `calculatePillars()`

```typescript
calculatePillars(): Pillars
```

Calculates and returns the Four Pillars of Destiny (Year, Month, Day, Hour) with their respective Chinese characters, elements, and animal signs.

##### `calculateBasicAnalysis()`

```typescript
calculateBasicAnalysis(): BasicAnalysis
```

Calculates the basic analysis, including the life Gua, Day Master details, Nobleman, Intelligence, Sky Horse, Peach Blossom, Five Factors percentages and Eight Mansions.

##### `getCompleteAnalysis()`

```typescript
getCompleteAnalysis(): CompleteAnalysis
```

Returns a complete analysis object containing both the calculated pillars and the basic analysis.

##### `toString()`

```typescript
toString(): string
```

Returns a string representation of the Bazi pillars, formatted as `YYYY年MM月DD日HH時` (e.g., `甲子年丙寅月戊辰日庚申時`).

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes and commit them (`git commit -am 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- This project was built using the `bazi-converter` to convert between Gregorian date and Chinese calendar.

## Support

If you have any questions or need support, feel free to open an issue on GitHub or contact me directly.

---
**Made with ❤️ by Alvamind**

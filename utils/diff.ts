
Array.prototype.last = function (this) {
  return this.slice(-1)[0]
}

interface IOperator {
  words:   string[]
  lengths: number[]
  maximum: number
  result:  number

  setResult(value: number): number
  diff(w1: string, w2: string): number
  diffTable(w1: string, w2: string): LetterMark[][]
}

export interface LetterMark {
  symbols:  string
  mark:     number
  selected: boolean
}

const diffExecutor: IOperator = {
  words:   [],
  lengths: [],
  maximum: 0,
  result:  0,

  setResult(value: number): number {
    this.result = value

    return value
  },

  diffTable(w1: string, w2: string): LetterMark[][] {
    if (w1 === w2)
      return []

    const ln_1: number = w1.length
    const ln_2: number = w2.length

    const table = Array.from({ length: ln_1 + 1 }).map(() => Array.from({ length: ln_2 + 1 }).map((): LetterMark => ({
      symbols:  "",
      mark:     0,
      selected: false,
    })))

    const a1: string[] = w1.split("")
    const a2: string[] = w2.split("")

    let digit: number = 0

    for (let i = 1; i <= ln_1; ++i) {
      table[i][0].symbols = a1[i - 1]
    }

    for (let j = 1; j <= ln_2; ++j) {
      table[0][j].symbols = a2[j - 1]
    }

    for (let j = 1; j <= ln_2; ++j) {
      for (let i = 1; i <= ln_1; ++i) {
        if (i > 1 && j > 1)
          digit = Math.min(table[i - 1][j - 1].mark, table[i][j - 1].mark, table[i - 1][j].mark)

        if (table[i][0].symbols !== table[0][j].symbols)
          ++digit

        table[i][j].mark = digit

        this.maximum = Math.max(this.maximum, digit)
      }

      digit = table[1][j].mark
    }

    let tx_1: string = ""
    let tx_2: string = ""

    let i: number = ln_1
    let j: number = ln_2

    const getPartBackwards = (): [boolean, string, string] => {
      let prev_1: string = ""
      let prev_2: string = ""

      if (table[i][0].symbols === table[0][j].symbols) {
        let tm: string = ""

        while (true) {
          table[i][j].selected = true
          table[i][0].selected = true
          table[0][j].selected = true

          tm = String(table[i][0].symbols) + tm

          --i
          --j

          if (i === 0 && j === 0 || table[i][0].symbols != table[0][j].symbols)
            return [true, tm, tm]
        }
      } else {
        let t1: string = ""
        let t2: string = ""

        while (true) {
          table[i][j].selected = true

          if (prev_1 == "" || prev_2 == "") {
            prev_1 = table[i][0].symbols
            prev_2 = table[0][j].symbols
          } else {
            if (prev_1 != table[i][0].symbols) {
              t1 = String(prev_1) + t1
              prev_1 = table[i][0].symbols
            }

            if (prev_2 != table[0][j].symbols) {
              t2 = String(prev_2) + t2
              prev_2 = table[0][j].symbols
            }

            if (i == 0 && j == 0 || table[i][0].symbols == table[0][j].symbols)
              return [false, t1, t2]
          }

          if (i <= 1 && j <= 1) {
            t1 = prev_1
            t2 = prev_2

            --i
            --j

            return [false, t1, t2]
          } else if (i <= 1) {
            --j // up
          } else if (j <= 1) {
            --i // left
          } else {
            const elem = table[i - 1][j - 1].mark

            if (table[i][0] === table[0][j]) {
              --i
              --j
            } else if (table[i - 1][j].mark < elem) {
              --i // left
            } else if (table[i][j - 1].mark < elem) {
              --j // up
            } else {
              --i
              --j
            }
          }
        }
      }
    }

    while (true) {
      const [isEqual, tm_1, tm_2] = getPartBackwards()

      if (i < 0)
        i = 0

      if (j < 0)
        j = 0

      if (isEqual) {
        tx_1 = tm_1 + tx_1
        tx_2 = tm_2 + tx_2
      } else {

        tx_1 = "<" + tm_1 + ">" + tx_1
        tx_2 = "<" + tm_2 + ">" + tx_2
      }

      if (i == 0 && j == 0)
        break
    }

    // TODO: make that on the page
    console.log(tx_1)
    console.log(tx_2)

    return table
  },
}

export default diffExecutor

import React, { type ReactElement, useEffect, useState } from "react"

import "./App.css"


import diffExecutor from "../utils/diff.ts"
import type { LetterMark } from "../utils/diff.ts"


export default function App() {
  const [textLeft,  setTextLeft ] = useState<string>("levenshtein")
  const [textRight, setTextRight] = useState<string>("meilenstein")

  const [table,     setTable    ] = useState<LetterMark[][]>([])

  useEffect(() => {
    setTable(diffExecutor.diffTable(textLeft, textRight))
  }, [textLeft, textRight])

  let lastLine: ReactElement = <React.Fragment />

  return (
    <>
      <div className="inputs">
        <input className="left" id="source" value={textLeft} onChange={(event) => setTextLeft(event.target.value)} />
        <input className="right" value={textRight} onChange={(event) => setTextRight(event.target.value)} />
      </div>

      <div className="result">
        <table>
          <tbody>
            {
              table.map((line: LetterMark[], rowIndex: number) => (
                <tr className={ rowIndex === 0 ? "first" : "" }>
                  {
                    line.map((item: LetterMark, columnIndex: number) => {
                      const heading: boolean = rowIndex === 0 || columnIndex === 0
                      let className = ""

                      if (heading)
                        lastLine = (
                          <tr className="last">
                            {
                              line.map((_, columnIndex: number) => (
                                columnIndex === 0
                                ? (
                                  <th><span>max</span></th>
                                )
                                : (
                                  <td>{diffExecutor.maximum}</td>
                                )
                              ))
                            }
                          </tr>
                        )

                      if (heading) {
                        if (item.selected)
                          className = "similar"
                        else
                          className = "difference"
                      } else {
                        if (item.selected)
                          className = "selected"
                      }

                      return (
                        <>
                          {
                            heading
                              ? (
                                <th className={className}>
                                  {
                                    item.symbols === " "
                                    ? (
                                      <div className="space">&nbsp;</div>
                                    )
                                    : (item.symbols)
                                  }
                                </th>
                              )
                              : (
                                <td className={className}>
                                  {String(item.mark)}
                                </td>
                              )
                          }
                        </>
                      )
                    })
                  }
                </tr>
              ))
            }
            {
              lastLine
            }
          </tbody>
        </table>
      </div>
    </>
  )
}
